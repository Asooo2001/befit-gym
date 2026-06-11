import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getVposSecret, signFields } from "@/lib/vpos";

// =============================================================
// DEV-ONLY mock bank gateway.
//
// Simulates a Kosovo bank's hosted VPOS page so the full checkout flow can be
// exercised end-to-end without real merchant credentials. To use it, point the
// initiate route at this endpoint in .env.local:
//
//   VPOS_GATEWAY_URL=http://localhost:3000/api/checkout/mock-bank
//   VPOS_MERCHANT_ID=mock
//   VPOS_TERMINAL_ID=mock
//   VPOS_SECRET_KEY=dev-secret-change-me
//
// The initiate form POSTs here; this page shows Approve / Decline buttons.
// On a decision it signs a callback exactly like a NestPay-style bank would,
// posts it server-to-server to /api/checkout/vpos-callback, then redirects the
// browser to the success/failure page — mirroring real bank behaviour.
//
// Returns 404 in production so it can never run against live credentials.
// =============================================================

function notInProd(): boolean {
  return process.env.NODE_ENV === "production";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  if (notInProd() === true) {
    return new NextResponse("Not found", { status: 404 });
  }

  const form = await request.formData();
  const params = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));

  const decision = params._decision;
  const orderId = params.OrderID ?? params.OrderId ?? "";
  const totalAmount = params.TotalAmount ?? "";

  // ── First hit: render the fake bank page ────────────────────────────────────
  if (!decision) {
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mock Bank VPOS — DEV ONLY</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0a0a0f; color: #e5e7eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
    .card { background: #14141c; border: 1px solid #ffffff1a; border-radius: 16px; padding: 32px; width: 360px; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    .tag { display: inline-block; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #f59e0b; border: 1px solid #f59e0b55; border-radius: 999px; padding: 3px 10px; margin-bottom: 16px; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; font-size: 13px; margin: 16px 0 24px; }
    dt { color: #9ca3af; } dd { margin: 0; font-family: monospace; text-align: right; }
    .row { display: flex; gap: 12px; }
    button { flex: 1; border: 0; border-radius: 999px; padding: 12px; font-weight: 600; font-size: 13px; cursor: pointer; }
    .approve { background: #22d3ee; color: #0a0a0f; }
    .decline { background: #ffffff10; color: #f87171; border: 1px solid #f8717155; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag">Mock Bank · Dev Only</span>
    <h1>Confirm your payment</h1>
    <dl>
      <dt>Order</dt><dd>${escapeHtml(orderId)}</dd>
      <dt>Amount</dt><dd>€${escapeHtml(totalAmount)}</dd>
    </dl>
    <form method="POST" class="row">
      <input type="hidden" name="OrderID" value="${escapeHtml(orderId)}" />
      <input type="hidden" name="TotalAmount" value="${escapeHtml(totalAmount)}" />
      <button class="approve" name="_decision" value="approve" type="submit">Approve</button>
      <button class="decline" name="_decision" value="decline" type="submit">Decline</button>
    </form>
  </div>
</body>
</html>`;
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // ── Decision hit: sign a callback, deliver it, then redirect the browser ─────
  const isApprove = decision === "approve";
  const responseCode = isApprove ? "00" : "05";
  const authCode = isApprove ? randomUUID().slice(0, 6).toUpperCase() : "";

  const callbackFields: Record<string, string> = {
    ResponseCode: responseCode,
    OrderId:      orderId, // callback route reads OrderId (lower-case d)
    AuthCode:     authCode,
    TotalAmount:  totalAmount,
  };

  let hash = "";
  try {
    hash = signFields(callbackFields, getVposSecret());
  } catch (err) {
    return new NextResponse(`Mock bank misconfigured: ${String(err)}`, { status: 503 });
  }

  const origin = new URL(request.url).origin;

  // Server-to-server callback — this is what actually activates the membership.
  await fetch(`${origin}/api/checkout/vpos-callback`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...callbackFields, HASH: hash }),
  });

  // Then redirect the customer's browser, just like the bank's okUrl/failUrl.
  const target = isApprove
    ? `/checkout/success?OrderID=${encodeURIComponent(orderId)}&Response=Approved&AuthCode=${encodeURIComponent(authCode)}&ProcReturnCode=${responseCode}`
    : `/checkout/failure?OrderID=${encodeURIComponent(orderId)}`;

  return NextResponse.redirect(new URL(target, origin), { status: 303 });
}
