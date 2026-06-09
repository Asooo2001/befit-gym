"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "granted";
      name: string;
      plan: string;
      expiresAt: string;
    }
  | { kind: "denied"; name?: string; reason: string }
  | { kind: "not_found" };

const RESET_DELAY_MS = 5000;

export default function AdminDashboard() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanBuffer = useRef("");
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // After showing a result, reset back to idle and re-focus after a delay.
  const scheduleReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setState({ kind: "idle" });
      setInput("");
      focusInput();
    }, RESET_DELAY_MS);
  }, [focusInput]);

  const lookup = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (!q) return;

      setState({ kind: "loading" });
      setInput("");

      try {
        const res = await fetch(
          `/api/admin/verify?q=${encodeURIComponent(q)}`
        );

        if (res.status === 404) {
          setState({ kind: "not_found" });
          scheduleReset();
          return;
        }

        if (!res.ok) {
          setState({ kind: "denied", reason: "Server error" });
          scheduleReset();
          return;
        }

        const data: {
          is_valid: boolean;
          full_name: string;
          plan: string | null;
          expires_at: string | null;
        } = await res.json();

        if (data.is_valid) {
          setState({
            kind: "granted",
            name: data.full_name,
            plan: data.plan ?? "Member",
            expiresAt: data.expires_at ?? "",
          });
        } else {
          setState({
            kind: "denied",
            name: data.full_name,
            reason:
              data.expires_at
                ? `Expired ${formatDate(data.expires_at)}`
                : "No active membership",
          });
        }
      } catch {
        setState({ kind: "denied", reason: "Network error" });
      }

      scheduleReset();
    },
    [scheduleReset]
  );

  // Barcode scanners fire characters rapidly then send Enter.
  // We debounce on a 60 ms gap as a fallback for scanners that don't send Enter.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    scanBuffer.current = val;

    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      const buffered = scanBuffer.current.trim();
      if (buffered.length >= 6) {
        lookup(buffered);
      }
    }, 80);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (scanTimer.current) clearTimeout(scanTimer.current);
      lookup(input);
    }
  }

  // Tapping anywhere on the result screen dismisses and resets immediately.
  function handleResultTap() {
    if (state.kind === "idle" || state.kind === "loading") return;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setState({ kind: "idle" });
    setInput("");
    focusInput();
  }

  const bg =
    state.kind === "granted"
      ? "bg-green-500"
      : state.kind === "denied" || state.kind === "not_found"
      ? "bg-red-600"
      : "bg-zinc-950";

  const isResult =
    state.kind === "granted" ||
    state.kind === "denied" ||
    state.kind === "not_found";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${bg}`}
      onClick={isResult ? handleResultTap : undefined}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <span className="text-sm font-semibold tracking-widest uppercase opacity-60 text-white">
          Be Fit Gym
        </span>
        <span className="text-sm opacity-40 text-white">Front Desk</span>
      </header>

      {/* ── Input zone — always visible so scanner can fire at any time ────── */}
      <div className="px-5 pt-2 pb-4">
        <input
          ref={inputRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={focusInput}
          type="text"
          inputMode="text"
          placeholder="Scan QR / barcode or enter phone number…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-2xl bg-white/10 border border-white/20 text-white
                     placeholder-white/40 px-5 py-4 text-lg focus:outline-none
                     focus:ring-2 focus:ring-white/50 caret-white"
        />
      </div>

      {/* ── Main display area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 select-none">
        {state.kind === "idle" && (
          <div className="text-center space-y-3 opacity-30">
            <div className="text-7xl">⬛</div>
            <p className="text-white text-xl font-medium">Ready to scan</p>
          </div>
        )}

        {state.kind === "loading" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-white text-xl font-medium opacity-70">
              Checking…
            </p>
          </div>
        )}

        {state.kind === "granted" && (
          <div className="text-center space-y-5 text-white">
            <div className="text-8xl">✓</div>
            <h2 className="text-5xl font-black tracking-tight leading-none">
              ACCESS
              <br />
              GRANTED
            </h2>
            <p className="text-2xl font-semibold mt-2">{state.name}</p>
            <div className="bg-white/20 rounded-2xl px-6 py-3 inline-block space-y-1">
              <p className="text-lg font-medium">{state.plan}</p>
              <p className="text-sm opacity-80">
                Valid until {formatDate(state.expiresAt)}
              </p>
            </div>
            <p className="text-sm opacity-50 mt-4">Tap to dismiss</p>
          </div>
        )}

        {state.kind === "denied" && (
          <div className="text-center space-y-5 text-white">
            <div className="text-8xl">✗</div>
            <h2 className="text-5xl font-black tracking-tight leading-none">
              ACCESS
              <br />
              DENIED
            </h2>
            {state.name && (
              <p className="text-2xl font-semibold">{state.name}</p>
            )}
            <div className="bg-white/20 rounded-2xl px-6 py-3 inline-block">
              <p className="text-lg font-medium">{state.reason}</p>
            </div>
            <p className="text-sm opacity-50 mt-4">Tap to dismiss</p>
          </div>
        )}

        {state.kind === "not_found" && (
          <div className="text-center space-y-5 text-white">
            <div className="text-8xl">?</div>
            <h2 className="text-5xl font-black tracking-tight leading-none">
              MEMBER
              <br />
              NOT FOUND
            </h2>
            <div className="bg-white/20 rounded-2xl px-6 py-3 inline-block">
              <p className="text-lg font-medium">No record in the system</p>
            </div>
            <p className="text-sm opacity-50 mt-4">Tap to dismiss</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
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
