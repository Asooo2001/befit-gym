import { randomUUID, createHmac } from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Prices are the single source of truth — never trust the value sent by the client.
const PACKAGES = [
  { id: "basic",   name: "Basic",   price: 29 },
  { id: "premium", name: "Premium", price: 49 },
  { id: "vip",     name: "VIP",     price: 79 },
] as const;

const CURRENCY_EUR      = "978";
const TRANSACTION_TYPE  = "purchase";

const VPOS_GATEWAY_URL = process.env.VPOS_GATEWAY_URL ?? "https://vpos.bank.example/payment/gateway";
const MERCHANT_ID      = process.env.VPOS_MERCHANT_ID ?? "";
const TERMINAL_ID      = process.env.VPOS_TERMINAL_ID ?? "";

interface VposInitiateBody {
  fullName?:  string;
  email?:     string;
  phone?:     string;
  packageId?: string;
  price?:     number; // client echo — verified server-side as a sanity check
}

// Asseco/NestPay-style HMAC-SHA256: sort field names alphabetically, join as
// key=value pairs, sign with the shared secret.
function signPayload(fields: Record<string, string>): string {
  const secret = process.env.VPOS_SECRET_KEY ?? "";
  const message = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  return createHmac("sha256", secret).update(message).digest("hex");
}

export async function POST(request: Request) {
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

  const selectedPackage = PACKAGES.find((pkg) => pkg.id === packageId);
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

  // ── 3. Generate a unique merchant order ID ───────────────────────────────────
  const orderId = `BEFIT-${selectedPackage.id.toUpperCase()}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const totalAmount = selectedPackage.price.toFixed(2);

  // ── 4. Record the transaction (status: initiated) ───────────────────────────
  const { error: txError } = await supabase.from("transactions").insert({
    id:        orderId,
    member_id: memberId,
    amount:    selectedPackage.price, // always the server-authoritative price
    status:    "initiated",
  });

  if (txError) {
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
  }

  // ── 5. Create matching membership (status: pending_payment) ─────────────────
  const { error: membershipError } = await supabase.from("memberships").insert({
    member_id: memberId,
    tier_name: selectedPackage.name,
    status:    "pending_payment",
  });

  if (membershipError) {
    // Best-effort rollback: remove the orphaned transaction so the order ID
    // can't be re-used in a confused state.
    await supabase.from("transactions").delete().eq("id", orderId);
    return NextResponse.json({ error: "Failed to create membership record" }, { status: 500 });
  }

  // ── 6. Build and sign the VPOS gateway payload ──────────────────────────────
  const fields: Record<string, string> = {
    MerchantID:      MERCHANT_ID,
    TerminalID:      TERMINAL_ID,
    TotalAmount:     totalAmount,
    Currency:        CURRENCY_EUR,
    TransactionType: TRANSACTION_TYPE,
    OrderID:         orderId,
    CustomerName:    fullName,
    CustomerEmail:   email,
    CustomerPhone:   phone,
  };

  const signature = signPayload(fields);

  return NextResponse.json({
    gatewayUrl: VPOS_GATEWAY_URL,
    formFields: { ...fields, Signature: signature },
  });
}
