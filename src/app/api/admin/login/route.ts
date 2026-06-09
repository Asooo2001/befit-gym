import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

async function deriveAdminToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + ":befit-admin-terminal-v1");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password: string = body?.password ?? "";

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminPassword) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (!password) {
    return Response.json({ error: "Password required" }, { status: 400 });
  }

  // Constant-time comparison via derived token
  const [submitted, expected] = await Promise.all([
    deriveAdminToken(password),
    deriveAdminToken(adminPassword),
  ]);

  if (submitted !== expected) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // No maxAge — persists for the browser session (permanent terminal use)
  });

  return Response.json({ ok: true });
}
