"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useJoinModal } from "./JoinModalProvider";
import { useLanguage } from "./LanguageProvider";
import type { Language } from "@/lib/translations";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "sq", label: "SQ" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { openJoinModal } = useJoinModal();
  const { lang, setLang, t } = useLanguage();

  const NAV_LINKS = [
    { href: "#features", label: t.nav.features },
    { href: "#memberships", label: t.nav.memberships },
    { href: "#location", label: t.nav.location },
  ];

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const HEADER_OFFSET = 64;

  const scrollToSection = (event: MouseEvent, href: string) => {
    const target = document.querySelector(href);
    if (!(target instanceof HTMLElement)) return;

    event.preventDefault();
    setIsOpen(false);

    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-obsidian/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              scrollToTop();
            } else {
              setIsOpen(false);
            }
          }}
          className="text-xl font-extrabold tracking-wide text-gradient-electric"
        >
          BE FIT GYM
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => scrollToSection(event, link.href)}
              className="text-sm font-medium text-silver transition-colors hover:text-cyan-glow"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher lang={lang} setLang={setLang} />

          <button
            type="button"
            onClick={() => openJoinModal()}
            className="inline-flex items-center justify-center rounded-full bg-gradient-electric px-6 py-2.5 text-sm font-semibold text-obsidian shadow-[0_0_24px_-4px_var(--color-cyan-glow)] transition-transform hover:scale-105"
          >
            {t.nav.joinNow}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher lang={lang} setLang={setLang} />

          <button
            type="button"
            aria-label={t.nav.toggleMenu}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-0.5 w-6 bg-foreground transition-transform duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-foreground transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-foreground transition-transform duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-white/10 bg-obsidian/90 backdrop-blur-md">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
                className="rounded-lg px-3 py-3 text-base font-medium text-silver transition-colors hover:bg-white/5 hover:text-cyan-glow"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openJoinModal();
              }}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-electric px-6 py-3 text-base font-semibold text-obsidian shadow-[0_0_24px_-4px_var(--color-cyan-glow)]"
            >
              {t.nav.joinNow}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function LanguageSwitcher({
  lang,
  setLang,
}: {
  lang: Language;
  setLang: (lang: Language) => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold uppercase tracking-wide">
      {LANGUAGES.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLang(option.code)}
          aria-pressed={lang === option.code}
          className={`rounded-full px-3 py-1.5 transition-colors duration-300 ${
            lang === option.code
              ? "bg-gradient-electric text-obsidian"
              : "text-silver hover:text-cyan-glow"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
