import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Dev-only helper: generates a sign-in link via the admin API so we can
// demo the auth flow without hitting Supabase's email rate limit.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const { email } = await request.json();
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { origin } = new URL(request.url);

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: email.trim(),
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate link" },
      { status: 500 }
    );
  }

  return NextResponse.json({ link: data.properties.action_link });
}
