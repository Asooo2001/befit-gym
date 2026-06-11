import { createHmac, timingSafeEqual } from "crypto";

// =============================================================
// Shared Virtual POS (VPOS) configuration and signing helpers.
//
// IMPORTANT: the signing scheme below is a PLACEHOLDER. Once you sign an
// e-commerce contract with a Kosovo bank (Raiffeisen, ProCredit, TEB, …)
// replace `signFields` with the exact algorithm from their integration
// document — field order, separators, and hash algorithm all differ between
// banks (NestPay v3, for example, uses a pipe-joined string + SHA-512 base64).
// =============================================================

export interface VposConfig {
  gatewayUrl: string;
  merchantId: string;
  terminalId: string;
  secretKey: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    // Fail loudly at request time rather than silently signing with an empty
    // secret — an empty secret would produce "valid"-looking signatures and
    // let unsigned callbacks through.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Full config — used by the initiate route to build the gateway form. */
export function getVposConfig(): VposConfig {
  return {
    gatewayUrl: required("VPOS_GATEWAY_URL"),
    merchantId: required("VPOS_MERCHANT_ID"),
    terminalId: required("VPOS_TERMINAL_ID"),
    secretKey: required("VPOS_SECRET_KEY"),
  };
}

/** Just the signing secret — used by the callback route, which only verifies. */
export function getVposSecret(): string {
  return required("VPOS_SECRET_KEY");
}

// Placeholder Asseco/NestPay-style HMAC: sort field names alphabetically, join
// as key=value pairs, sign with HMAC-SHA256, return hex.
export function signFields(fields: Record<string, string>, secret: string): string {
  const message = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  return createHmac("sha256", secret).update(message).digest("hex");
}

/** Constant-time signature comparison. */
export function verifySignature(
  fields: Record<string, string>,
  receivedSignature: string,
  secret: string,
): boolean {
  const expected = signFields(fields, secret);
  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(receivedSignature, "utf8"),
    );
  } catch {
    // Buffers differ in length — definitely not equal.
    return false;
  }
}
