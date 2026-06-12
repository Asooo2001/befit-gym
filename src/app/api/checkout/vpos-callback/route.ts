import { supabase } from "@/lib/supabase";
import { getVposSecret, verifySignature } from "@/lib/vpos";
import { getPackageByName } from "@/lib/membershipPlans";
import { sendMembershipActivationEmail } from "@/lib/email";

function plainText(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "Content-Type": "text/plain" } });
}

export async function POST(request: Request) {
  // ── 1. Parse form-encoded payload sent by the bank ──────────────────────────
  let params: Record<string, string>;
  try {
    const formData = await request.formData();
    params = Object.fromEntries(
      [...formData.entries()].map(([k, v]) => [k, String(v)])
    );
  } catch {
    return plainText("INVALID", 400);
  }

  const { HASH, ...fieldsToVerify } = params;
  const { ResponseCode, OrderId, AuthCode, TotalAmount } = fieldsToVerify;

  // ── 2. Validate signature ────────────────────────────────────────────────────
  let secret: string;
  try {
    secret = getVposSecret();
  } catch (err) {
    console.error("VPOS configuration error:", err);
    return plainText("INVALID", 503);
  }

  const signatureValid = Boolean(HASH) && verifySignature(fieldsToVerify, HASH, secret);

  // Record the raw callback for dispute auditing, regardless of validity.
  await supabase.from("payment_callbacks").insert({
    order_id:        OrderId ?? null,
    payload:         params,
    signature_valid: signatureValid,
  });

  if (!signatureValid || !OrderId) {
    return plainText("INVALID", 400);
  }

  // ── 3. Load the transaction and enforce idempotency ──────────────────────────
  const { data: tx, error: txError } = await supabase
    .from("transactions")
    .select("member_id, membership_id, amount, status")
    .eq("id", OrderId)
    .single();

  if (txError || !tx) {
    // Unknown order — acknowledge so the bank stops retrying.
    return plainText("OK");
  }

  const transaction = tx as {
    member_id: string;
    membership_id: string | null;
    amount: number;
    status: string;
  };

  // Already processed: a replayed or duplicate callback must not re-run the
  // activation/deletion side effects. Acknowledge and stop.
  if (transaction.status !== "initiated") {
    return plainText("OK");
  }

  // ── 4. Verify the amount the bank reports matches what we recorded ───────────
  // Guards against a tampered or mismatched callback activating a membership
  // that was paid for at a different price.
  const amountMatches =
    TotalAmount === undefined ||
    Number(TotalAmount).toFixed(2) === Number(transaction.amount).toFixed(2);

  const isSuccess = ResponseCode === "00" && amountMatches;

  // ── 5. Mark the transaction terminal state (only from 'initiated') ───────────
  const { data: updatedTx } = await supabase
    .from("transactions")
    .update({
      status:         isSuccess ? "completed" : "failed",
      bank_reference: AuthCode ?? null,
    })
    .eq("id", OrderId)
    .eq("status", "initiated") // optimistic lock: lose the race ⇒ no rows
    .select("id")
    .maybeSingle();

  // Another concurrent callback already transitioned this transaction.
  if (!updatedTx) {
    return plainText("OK");
  }

  // ── 6. Apply the side effect to the exact linked membership ──────────────────
  if (!transaction.membership_id) {
    // Legacy transaction with no linked membership — nothing precise to update.
    return plainText(isSuccess ? "APPROVED" : "OK");
  }

  if (isSuccess) {
    const { data: m } = await supabase
      .from("memberships")
      .select("tier_name")
      .eq("id", transaction.membership_id)
      .maybeSingle();

    const tierName = (m as { tier_name: string } | null)?.tier_name ?? "";
    const days = getPackageByName(tierName)?.days ?? 30;

    const startDate = new Date();
    const endDate   = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    await supabase
      .from("memberships")
      .update({
        status:     "active",
        start_date: startDate.toISOString(),
        end_date:   endDate.toISOString(),
      })
      .eq("id",     transaction.membership_id)
      .eq("status", "pending_payment");

    await notifyMemberByEmail({
      memberId:      transaction.member_id,
      membershipId:  transaction.membership_id,
      tierName,
      startDate,
      endDate,
      amount:        transaction.amount,
      orderId:       OrderId,
      bankReference: AuthCode ?? null,
    });
  } else {
    // Remove the unfulfilled membership. The transactions row already records
    // the failure for audit purposes (and the FK is ON DELETE SET NULL).
    await supabase
      .from("memberships")
      .delete()
      .eq("id",     transaction.membership_id)
      .eq("status", "pending_payment");
  }

  return plainText(isSuccess ? "APPROVED" : "OK");
}

// Sends the QR code + receipt email for a newly activated membership. Best
// effort — a failure here must not affect the bank's view of the payment.
async function notifyMemberByEmail(params: {
  memberId: string;
  membershipId: string;
  tierName: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  orderId: string;
  bankReference: string | null;
}) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", params.memberId)
      .maybeSingle();

    if (!profile?.email) return;

    await sendMembershipActivationEmail({
      to:            profile.email,
      fullName:      profile.full_name,
      tierName:      params.tierName,
      startDate:     params.startDate,
      endDate:       params.endDate,
      amount:        params.amount,
      orderId:       params.orderId,
      bankReference: params.bankReference,
      qrValue:       `BEFIT|${profile.phone}|${params.membershipId}`,
    });
  } catch (err) {
    console.error("Failed to send membership activation email:", err);
  }
}
