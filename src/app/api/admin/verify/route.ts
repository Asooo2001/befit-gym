import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Middleware already validates the admin_session cookie before this runs.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const raw = params.get("q")?.trim() ?? "";

  if (!raw) {
    return Response.json(
      { error: "Provide a q query parameter (phone or member ID)" },
      { status: 400 }
    );
  }

  const isUuid = UUID_RE.test(raw);

  if (isUuid) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .eq("id", raw)
      .maybeSingle();

    if (error) return Response.json({ error: "Database error" }, { status: 500 });
    if (!profile) return Response.json({ error: "Member not found" }, { status: 404 });

    return getMemberStatus(profile.id, profile.full_name, profile.phone);
  }

  // Treat as phone number — strip common formatting characters
  const phone = raw.replace(/[\s\-().]/g, "");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("phone", phone)
    .maybeSingle();

  if (error) return Response.json({ error: "Database error" }, { status: 500 });
  if (!profile) return Response.json({ error: "Member not found" }, { status: 404 });

  return getMemberStatus(profile.id, profile.full_name, profile.phone);
}

async function getMemberStatus(
  memberId: string,
  fullName: string,
  phone: string
) {
  const { data: membership, error } = await supabase
    .from("memberships")
    .select("status, tier_name, start_date, end_date")
    .eq("member_id", memberId)
    .not("end_date", "is", null)
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return Response.json({ error: "Database error" }, { status: 500 });

  const now = new Date().toISOString();

  const is_valid =
    membership !== null &&
    membership.status === "active" &&
    membership.start_date !== null &&
    membership.start_date <= now &&
    membership.end_date !== null &&
    membership.end_date >= now;

  return Response.json({
    member_id: memberId,
    full_name: fullName,
    phone,
    is_valid,
    plan: membership?.tier_name ?? null,
    expires_at: membership?.end_date ?? null,
  });
}
