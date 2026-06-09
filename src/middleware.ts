import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constant-time string comparison — runs over the full length of both inputs
// so the elapsed time does not reveal how many characters match.
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

function isStaffAuthorized(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(authHeader.slice(6));
  } catch {
    return false;
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return false;

  const username = decoded.slice(0, sep);
  const password = decoded.slice(sep + 1);

  const expectedUser = process.env.STAFF_USERNAME ?? "";
  const expectedPass = process.env.STAFF_PASSWORD ?? "";

  if (!expectedUser || !expectedPass) return false;

  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

async function deriveAdminToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + ":befit-admin-terminal-v1");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminPassword) return false;

  const sessionToken = request.cookies.get("admin_session")?.value;
  if (!sessionToken) return false;

  const expected = await deriveAdminToken(adminPassword);
  return safeEqual(sessionToken, expected);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Staff API routes — Basic Auth
  if (pathname.startsWith("/api/members/")) {
    if (!isStaffAuthorized(request.headers.get("authorization"))) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Be Fit Gym Staff", charset="UTF-8"',
        },
      });
    }
    return NextResponse.next();
  }

  // Admin UI + admin API routes — cookie session
  if (pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/")) {
    // Login page and login API are always accessible
    if (
      pathname === "/admin/login" ||
      pathname === "/api/admin/login"
    ) {
      return NextResponse.next();
    }

    const authorized = await isAdminAuthorized(request);
    if (!authorized) {
      // API routes return 401; UI routes redirect to login
      if (pathname.startsWith("/api/admin/")) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/members/:path*", "/admin/:path*", "/api/admin/:path*"],
};
