"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CheckoutFailurePage() {
  const { t } = useLanguage();
  const f = t.checkout.failure;

  return (
    <section className="relative bg-obsidian py-24">
      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400">
            <XCircle className="h-9 w-9" strokeWidth={1.75} />
          </span>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-400 backdrop-blur-sm">
              {f.badge}
            </span>
            <h1 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
              {f.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-silver">{f.description}</p>
          </div>

          <Link
            href="/#memberships"
            className="inline-flex items-center justify-center rounded-full bg-gradient-electric px-8 py-4 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
          >
            {f.tryAgain}
          </Link>

          <Link href="/" className="text-sm font-medium text-silver transition-colors hover:text-cyan-glow">
            {f.backToHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
