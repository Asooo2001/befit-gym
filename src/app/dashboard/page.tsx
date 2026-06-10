import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "react-qr-code";
import { CalendarClock, IdCard } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import RenewMembershipButton from "@/components/RenewMembershipButton";

const EXPIRY_WARNING_DAYS = 5;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("tier_name, status, start_date, end_date")
    .eq("member_id", profile.id)
    .not("end_date", "is", null)
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date();
  const endDate = membership?.end_date ? new Date(membership.end_date) : null;

  const isActive =
    membership?.status === "active" &&
    membership.start_date !== null &&
    endDate !== null &&
    new Date(membership.start_date) <= now &&
    endDate >= now;

  const daysRemaining = endDate
    ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isExpiringSoon =
    isActive && daysRemaining !== null && daysRemaining <= EXPIRY_WARNING_DAYS;

  const showRenew = !isActive || isExpiringSoon;
  const tierName = membership?.tier_name ?? "No Active Plan";

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-obsidian px-6 py-24">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-cyan-glow/40 bg-white/5 p-8 backdrop-blur-sm shadow-[0_0_64px_-12px_var(--color-cyan-glow)]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
              <IdCard className="h-3.5 w-3.5" strokeWidth={2} />
              Membership Card
            </span>
            <h1 className="mt-6 text-2xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-3xl">
              {profile.full_name}
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-gradient-electric">
              {tierName}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            {!isActive ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
                Expired
              </span>
            ) : isExpiringSoon ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
                Expires in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow">
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
                Expires in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="rounded-xl bg-white p-3">
              <QRCode value={profile.id} size={160} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-silver">
              Scan at front desk to check in
            </p>
          </div>

          {showRenew && (
            <div className="mt-8">
              <RenewMembershipButton
                fullName={profile.full_name}
                email={profile.email}
                phone={profile.phone}
                tierName={tierName}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
