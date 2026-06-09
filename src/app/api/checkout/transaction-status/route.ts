import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const { data: tx, error: txError } = await supabase
    .from("transactions")
    .select("status, member_id")
    .eq("id", orderId)
    .single();

  if (txError || !tx) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const status = (tx as { status: string; member_id: string }).status;
  const memberId = (tx as { status: string; member_id: string }).member_id;

  if (status !== "completed") {
    return NextResponse.json({ status });
  }

  // Fetch profile and active membership in parallel.
  const [profileResult, membershipResult] = await Promise.all([
    supabase.from("profiles").select("phone, full_name").eq("id", memberId).single(),
    supabase
      .from("memberships")
      .select("id, tier_name")
      .eq("member_id", memberId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle(),
  ]);

  const profile = profileResult.data as { phone: string; full_name: string } | null;
  const membership = membershipResult.data as { id: string; tier_name: string } | null;

  return NextResponse.json({
    status,
    memberData: profile && membership
      ? {
          phone: profile.phone,
          fullName: profile.full_name,
          membershipId: membership.id,
          tierName: membership.tier_name,
        }
      : null,
  });
}
