import { supabase } from "@/lib/supabase";

// Middleware already validates the admin_session cookie before this runs.
export async function GET() {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email, created_at")
    .order("full_name", { ascending: true });

  if (profilesError) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("member_id, tier_name, status, start_date, end_date")
    .order("end_date", { ascending: false, nullsFirst: false });

  if (membershipsError) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  // Memberships are ordered by end_date desc, so the first one seen per
  // member is their most recent (current or most recently expired) plan.
  const latestByMember = new Map<string, (typeof memberships)[number]>();
  for (const m of memberships ?? []) {
    if (!latestByMember.has(m.member_id)) {
      latestByMember.set(m.member_id, m);
    }
  }

  const EXPIRY_WARNING_DAYS = 5;
  const nowMs = Date.now();
  const now = new Date(nowMs).toISOString();

  const members = (profiles ?? []).map((profile) => {
    const membership = latestByMember.get(profile.id) ?? null;

    const is_active =
      membership !== null &&
      membership.status === "active" &&
      membership.start_date !== null &&
      membership.start_date <= now &&
      membership.end_date !== null &&
      membership.end_date >= now;

    const days_remaining = membership?.end_date
      ? Math.ceil((new Date(membership.end_date).getTime() - nowMs) / (1000 * 60 * 60 * 24))
      : null;

    const is_expiring_soon =
      is_active && days_remaining !== null && days_remaining <= EXPIRY_WARNING_DAYS;

    return {
      id: profile.id,
      full_name: profile.full_name,
      phone: profile.phone,
      email: profile.email,
      created_at: profile.created_at,
      plan: membership?.tier_name ?? null,
      status: membership?.status ?? "no_membership",
      is_active,
      is_expiring_soon,
      days_remaining,
      expires_at: membership?.end_date ?? null,
    };
  });

  return Response.json({ members });
}
