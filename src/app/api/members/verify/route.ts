import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const params   = request.nextUrl.searchParams;
  const phone    = params.get("phone")?.trim() ?? "";
  const memberId = params.get("id")?.trim()    ?? "";

  // ── 1. Validate query parameters ────────────────────────────────────────────
  if (!phone && !memberId) {
    return Response.json(
      { error: "Provide either a phone or id query parameter" },
      { status: 400 }
    );
  }

  if (memberId && !UUID_RE.test(memberId)) {
    return Response.json(
      { error: "id must be a valid UUID" },
      { status: 400 }
    );
  }

  // ── 2. Look up the member profile ────────────────────────────────────────────
  const column = phone ? "phone" : "id";
  const value  = phone || memberId;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .eq(column, value)
    .maybeSingle();

  if (profileError) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  if (!profile) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  // ── 3. Fetch the most recent membership ──────────────────────────────────────
  // Ordered by end_date descending so the latest membership surfaces first,
  // covering cases where a member renews before the current period ends.
  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .select("status, tier_name, start_date, end_date")
    .eq("member_id", profile.id)
    .not("end_date", "is", null)
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  // ── 4. Compute validity ──────────────────────────────────────────────────────
  // A membership is valid today only when the DB status is 'active' AND the
  // current timestamp falls within [start_date, end_date].  The date check
  // guards against stale 'active' rows whose end_date has already passed.
  const now = new Date().toISOString();

  const is_valid =
    membership !== null &&
    membership.status === "active" &&
    membership.start_date !== null &&
    membership.start_date <= now &&
    membership.end_date !== null &&
    membership.end_date >= now;

  return Response.json({
    member_id:  profile.id,
    full_name:  profile.full_name,
    phone:      profile.phone,
    is_valid,
    plan:       membership?.tier_name ?? null,
    expires_at: membership?.end_date  ?? null,
  });
}
