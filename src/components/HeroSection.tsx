"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useJoinModal } from "./JoinModalProvider";
import { useLanguage } from "./LanguageProvider";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { openJoinModal } = useJoinModal();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-obsidian">
      {/* Background photo */}
      <Image
        src="/woman-gym-background.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="pointer-events-none absolute inset-0 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-obsidian/70"
      />

      {/* Subtle geometric overlay pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-cyan-glow) 1px, transparent 1px), linear-gradient(45deg, var(--color-electric-blue) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-electric-blue/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-glow/20 blur-[120px]"
      />

      {/* Bottom fade into page background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-32">
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.badge}
        </span>

        <h1
          className={`max-w-3xl text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-foreground transition-all delay-150 duration-700 ease-out sm:text-6xl md:text-7xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {t.hero.titleStart}
          <span className="text-gradient-electric">{t.hero.titleHighlight}</span>
          {t.hero.titleEnd}
        </h1>

        <p
          className={`max-w-xl text-lg leading-relaxed text-silver transition-all delay-300 duration-700 ease-out sm:text-xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {t.hero.subtitle}
        </p>

        <div
          className={`flex flex-col gap-4 transition-all delay-500 duration-700 ease-out sm:flex-row sm:items-center ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => openJoinModal()}
            className="inline-flex items-center justify-center rounded-full bg-gradient-electric px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
          >
            {t.hero.ctaPrimary}
          </button>

          <Link
            href="#memberships"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors duration-300 hover:border-cyan-glow hover:text-cyan-glow"
          >
            {t.hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
