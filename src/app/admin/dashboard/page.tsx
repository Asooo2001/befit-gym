"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ScanLine, Users } from "lucide-react";
import CheckInPanel from "./CheckInPanel";
import MembersPanel from "./MembersPanel";

type Tab = "checkin" | "members";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("checkin");
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-widest uppercase opacity-60 text-white">
            Be Fit Gym
          </span>
          <span className="text-sm opacity-40 text-white">Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <TabButton
            active={tab === "checkin"}
            onClick={() => setTab("checkin")}
            icon={<ScanLine className="w-4 h-4" />}
            label="Check-in"
          />
          <TabButton
            active={tab === "members"}
            onClick={() => setTab("members")}
            icon={<Users className="w-4 h-4" />}
            label="Members"
          />

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5
                       text-xs font-medium text-white/70 hover:text-white hover:bg-white/10
                       disabled:opacity-40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </header>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      {tab === "checkin" ? <CheckInPanel /> : <MembersPanel />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-white text-zinc-950"
          : "border border-white/20 text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
