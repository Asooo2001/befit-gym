import { createHmac, timingSafeEqual } from "crypto";
import { supabase } from "@/lib/supabase";

// Duration in months for each membership tier.
const TIER_MONTHS: Record<string, number> = {
  Basic:   1,
  Premium: 1,
  VIP:     1,
};

// Asseco/NestPay-style HMAC-SHA256: sort all non-HASH field names alphabetically,
// join as key=value pairs, sign with the shared secret.
function computeHash(fields: Record<string, string>): string {
  const secret = process.env.VPOS_SECRET_KEY ?? "";
  const message = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  return createHmac("sha256", secret).update(message).digest("hex");
}

function verifyHash(fields: Record<string, string>, receivedHash: string): boolean {
  const expected = computeHash(fields);
  try {
    return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(receivedHash, "utf8"));
  } catch {
    // Buffers differ in length — definitely not equal.
    return false;
  }
}

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
  const { ResponseCode, OrderId, AuthCode } = fieldsToVerify;

  // ── 2. Validate signature ────────────────────────────────────────────────────
  if (!HASH || !OrderId || !verifyHash(fieldsToVerify, HASH)) {
    return plainText("INVALID", 400);
  }

  const isSuccess = ResponseCode === "00";

  // ── 3. Update transaction ────────────────────────────────────────────────────
  const { data: tx, error: txError } = await supabase
    .from("transactions")
    .update({
      status:         isSuccess ? "completed" : "failed",
      bank_reference: AuthCode ?? null,
    })
    .eq("id", OrderId)
    .select("member_id")
    .single();

  if (txError || !tx) {
    // Unknown order — acknowledge the bank so it stops retrying, but log nothing.
    return plainText("OK");
  }

  if (isSuccess) {
    // ── 4a. Activate the membership ────────────────────────────────────────────
    // Derive tier name from order ID format: BEFIT-{TIER}-{timestamp}-{uuid}
    const tierKey = OrderId.split("-")[1] ?? "";
    const tierName = tierKey.charAt(0).toUpperCase() + tierKey.slice(1).toLowerCase();
    const months = TIER_MONTHS[tierName] ?? 1;

    const startDate = new Date();
    const endDate   = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    await supabase
      .from("memberships")
      .update({
        status:     "active",
        start_date: startDate.toISOString(),
        end_date:   endDate.toISOString(),
      })
      .eq("member_id", tx.member_id)
      .eq("status",    "pending_payment")
      .eq("tier_name", tierName);
  } else {
    // ── 4b. Remove the unfulfilled membership record ───────────────────────────
    // The transactions row already captures the failure for audit purposes.
    await supabase
      .from("memberships")
      .delete()
      .eq("member_id", tx.member_id)
      .eq("status",    "pending_payment");
  }

  return plainText("APPROVED");
}
