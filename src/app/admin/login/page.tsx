"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace("/admin/dashboard");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Invalid password");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase">
            Be Fit Gym
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Staff Access</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500
                       px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-white text-zinc-950 font-semibold py-4 text-lg
                       disabled:opacity-40 active:scale-95 transition-transform"
          >
            {loading ? "Verifying…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
