"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Send, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (!error) {
            router.replace("/dashboard");
          }
        });
        return;
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const value = identifier.trim();
    if (!value) {
      setError("Enter your email or phone number to continue.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = EMAIL_PATTERN.test(value)
      ? await supabase.auth.signInWithOtp({
          email: value,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
      : await supabase.auth.signInWithOtp({ phone: value });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  };

  const handleDevSignIn = async () => {
    setError(null);

    const value = identifier.trim();
    if (!value) {
      setError("Enter your email to continue.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/dev/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to sign in.");
      return;
    }

    window.location.href = data.link;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-midnight p-10 shadow-[0_0_64px_-12px_var(--color-cyan-glow)]">
        <Link
          href="/"
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-silver transition-colors duration-300 hover:border-cyan-glow hover:text-cyan-glow"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </Link>

        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
            Members Access
          </span>
          <h1 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            Sign in to <span className="text-gradient-electric">Be Fit Gym</span>
          </h1>
          <p className="mt-3 text-sm text-silver">
            Enter your email or phone number and we&apos;ll send you a secure
            link to sign in &mdash; no password needed.
          </p>
        </div>

        {sent ? (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-cyan-glow/30 bg-white/5 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow shadow-[0_0_32px_-6px_var(--color-cyan-glow)]">
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="text-sm leading-relaxed text-silver">
              Check your inbox/messages for your instant entry link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Email or phone number
              </label>
              <input
                id="identifier"
                type="text"
                inputMode="email"
                autoComplete="email"
                placeholder="Email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-foreground placeholder:text-silver focus:border-cyan-glow/60 focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-electric px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
                  Sending&hellip;
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" strokeWidth={2.25} />
                  Send Access Link
                </>
              )}
            </button>

            {process.env.NODE_ENV !== "production" && (
              <button
                type="button"
                onClick={handleDevSignIn}
                disabled={loading}
                className="text-center text-xs text-silver underline underline-offset-4 hover:text-cyan-glow disabled:opacity-60"
              >
                Dev: sign in instantly (skip email)
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
