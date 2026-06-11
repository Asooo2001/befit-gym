import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getVposConfig, signFields } from "@/lib/vpos";
import { getPackageById } from "@/lib/membershipPlans";

const CURRENCY_EUR     = "978";
const TRANSACTION_TYPE = "purchase";

interface VposInitiateBody {
  fullName?:  string;
  email?:     string;
  phone?:     string;
  packageId?: string;
  price?:     number; // client echo — verified server-side as a sanity check
}

export async function POST(request: Request) {
  // ── 0. Load & validate gateway configuration ────────────────────────────────
  // Throws if any VPOS_* env var is missing, so we never sign with an empty
  // secret or post to a placeholder gateway.
  let config;
  try {
    config = getVposConfig();
  } catch (err) {
    console.error("VPOS configuration error:", err);
    return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 503 });
  }

  // ── 1. Parse & validate request body ────────────────────────────────────────
  let body: VposInitiateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fullName, email, phone, packageId, price } = body;

  if (!fullName || !email || !phone || !packageId) {
    return NextResponse.json(
      { error: "Missing required fields: fullName, email, phone, packageId" },
      { status: 400 }
    );
  }

  const selectedPackage = getPackageById(packageId);
  if (!selectedPackage) {
    return NextResponse.json({ error: "Unknown package" }, { status: 400 });
  }

  // Reject requests where the client-side price doesn't match — guards against
  // stale cached UIs sending an outdated price.
  if (typeof price === "number" && price !== selectedPackage.price) {
    return NextResponse.json(
      { error: "Submitted price does not match the package price" },
      { status: 400 }
    );
  }

  // ── 2. Find or create the member profile ────────────────────────────────────
  let memberId: string;

  const { data: existingProfile, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: "Database error during profile lookup" }, { status: 500 });
  }

  if (existingProfile) {
    memberId = existingProfile.id as string;
  } else {
    const { data: newProfile, error: insertProfileError } = await supabase
      .from("profiles")
      .insert({ full_name: fullName, phone, email })
      .select("id")
      .single();

    if (insertProfileError || !newProfile) {
      const isPhoneConflict =
        insertProfileError?.code === "23505" &&
        insertProfileError.message.includes("phone");
      return NextResponse.json(
        {
          error: isPhoneConflict
            ? "Phone number is already registered to another account"
            : "Failed to create member profile",
        },
        { status: isPhoneConflict ? 409 : 500 }
      );
    }

    memberId = (newProfile as { id: string }).id;
  }

  // ── 3. Create the pending membership first ──────────────────────────────────
  // Creating it up-front gives us a concrete membership id to bind the
  // transaction to, so the callback can activate the exact right row even when
  // a member has several outstanding orders.
  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .insert({
      member_id: memberId,
      tier_name: selectedPackage.name,
      status:    "pending_payment",
    })
    .select("id")
    .single();

  if (membershipError || !membership) {
    return NextResponse.json({ error: "Failed to create membership record" }, { status: 500 });
  }

  const membershipId = (membership as { id: string }).id;

  // ── 4. Generate a unique merchant order ID ───────────────────────────────────
  const orderId = `BEFIT-${selectedPackage.id.toUpperCase()}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const totalAmount = selectedPackage.price.toFixed(2);

  // ── 5. Record the transaction (status: initiated), linked to the membership ──
  const { error: txError } = await supabase.from("transactions").insert({
    id:            orderId,
    member_id:     memberId,
    membership_id: membershipId,
    amount:        selectedPackage.price, // always the server-authoritative price
    status:        "initiated",
  });

  if (txError) {
    // Roll back the orphaned pending membership so it can't be activated later.
    await supabase.from("memberships").delete().eq("id", membershipId);
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
  }

  // ── 6. Build and sign the VPOS gateway payload ──────────────────────────────
  const fields: Record<string, string> = {
    MerchantID:      config.merchantId,
    TerminalID:      config.terminalId,
    TotalAmount:     totalAmount,
    Currency:        CURRENCY_EUR,
    TransactionType: TRANSACTION_TYPE,
    OrderID:         orderId,
    CustomerName:    fullName,
    CustomerEmail:   email,
    CustomerPhone:   phone,
  };

  const signature = signFields(fields, config.secretKey);

  return NextResponse.json({
    gatewayUrl: config.gatewayUrl,
    formFields: { ...fields, Signature: signature },
  });
}
