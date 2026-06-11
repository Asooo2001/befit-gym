"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

type Member = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
  plan: string | null;
  status: string;
  is_active: boolean;
  is_expiring_soon: boolean;
  days_remaining: number | null;
  expires_at: string | null;
};

type Filter = "all" | "active" | "expiring" | "inactive";

async function fetchMembers(): Promise<Member[]> {
  const res = await fetch("/api/admin/members");
  if (!res.ok) throw new Error("Failed to load members");
  const data: { members: Member[] } = await res.json();
  return data.members;
}

export default function MembersPanel() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    fetchMembers()
      .then((data) => {
        if (!cancelled) setMembers(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load members");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function load() {
    setLoading(true);
    setError("");
    fetchMembers()
      .then(setMembers)
      .catch(() => setError("Failed to load members"))
      .finally(() => setLoading(false));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");

    return (members ?? []).filter((m) => {
      if (q) {
        const textMatch = `${m.full_name} ${m.email}`
          .toLowerCase()
          .includes(q);

        let phoneMatch = false;
        if (qDigits) {
          const phoneDigits = m.phone.replace(/\D/g, "");
          // Kosovo numbers are stored as +383XXXXXXXXX but staff usually
          // type the local form starting with 0 (e.g. 044 123 456).
          const localPhoneDigits = phoneDigits.replace(/^383/, "0");
          const queryLocalDigits = qDigits.replace(/^0/, "");
          phoneMatch =
            phoneDigits.includes(qDigits) ||
            localPhoneDigits.includes(qDigits) ||
            phoneDigits.includes(queryLocalDigits);
        }

        if (!textMatch && !phoneMatch) return false;
      }
      switch (filter) {
        case "active":
          return m.is_active;
        case "expiring":
          return m.is_expiring_soon;
        case "inactive":
          return !m.is_active;
        default:
          return true;
      }
    });
  }, [members, query, filter]);

  const counts = useMemo(() => {
    const all = members ?? [];
    const active = all.filter((m) => m.is_active).length;
    const expiring = all.filter((m) => m.is_expiring_soon).length;
    const inactive = all.length - active;
    return { all: all.length, active, expiring, inactive };
  }, [members]);

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 px-5 py-4 overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by name, phone, or email…"
            className="w-full rounded-xl bg-white/10 border border-white/20 text-white
                       placeholder-white/40 pl-9 pr-4 py-2.5 text-sm focus:outline-none
                       focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All ({counts.all})
          </FilterButton>
          <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
            Active ({counts.active})
          </FilterButton>
          <FilterButton active={filter === "expiring"} onClick={() => setFilter("expiring")}>
            Expiring soon ({counts.expiring})
          </FilterButton>
          <FilterButton active={filter === "inactive"} onClick={() => setFilter("inactive")}>
            Inactive ({counts.inactive})
          </FilterButton>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5
                       text-xs font-medium text-white/70 hover:text-white hover:bg-white/10
                       disabled:opacity-40 transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto rounded-xl border border-white/10">
        {error && (
          <div className="p-6 text-center text-red-400 text-sm">{error}</div>
        )}

        {!error && loading && !members && (
          <div className="p-10 flex justify-center">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {!error && members && filtered.length === 0 && (
          <div className="p-6 text-center text-white/40 text-sm">
            No members found.
          </div>
        )}

        {!error && filtered.length > 0 && (
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-zinc-900 text-white/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((m) => (
                <tr key={m.id} className="text-white/90 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{m.full_name}</td>
                  <td className="px-4 py-3 text-white/60">{m.phone}</td>
                  <td className="px-4 py-3 text-white/60 hidden md:table-cell">
                    {m.email}
                  </td>
                  <td className="px-4 py-3 text-white/60">{m.plan ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      isActive={m.is_active}
                      isExpiringSoon={m.is_expiring_soon}
                      status={m.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {formatDate(m.expires_at)}
                    {m.is_active && m.days_remaining !== null && (
                      <span className="text-white/30">
                        {" "}
                        ({m.days_remaining} {m.days_remaining === 1 ? "day" : "days"})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
        active
          ? "bg-white text-zinc-950"
          : "border border-white/20 text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({
  isActive,
  isExpiringSoon,
  status,
}: {
  isActive: boolean;
  isExpiringSoon: boolean;
  status: string;
}) {
  if (isExpiringSoon) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-400">
        Expiring soon
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="inline-flex items-center rounded-full border border-green-400/40 bg-green-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-green-400">
        Active
      </span>
    );
  }

  if (status === "no_membership") {
    return (
      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/50">
        No plan
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-400">
      Expired
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
