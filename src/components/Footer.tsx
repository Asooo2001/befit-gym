"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const SOCIAL_LINKS = [
  { href: "https://instagram.com/befitgymks", label: "Instagram", icon: InstagramIcon },
  {
    href: "https://wa.me/38348367555",
    label: "WhatsApp",
    icon: MessageCircle,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  const FOOTER_LINKS = [
    { href: "#features", label: t.nav.features },
    { href: "#memberships", label: t.nav.memberships },
    { href: "#location", label: t.nav.location },
  ];

  return (
    <footer className="border-t border-white/10 bg-obsidian">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-xl font-extrabold tracking-wide text-gradient-electric"
          >
            BE FIT GYM
          </Link>
          <p className="mt-2 text-sm text-silver">{t.footer.tagline}</p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-silver transition-colors hover:text-cyan-glow"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-silver transition-colors duration-300 hover:border-cyan-glow/40 hover:text-cyan-glow"
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-silver">
        <p>
          © {year} Be Fit Gym Suhareka. {t.footer.poweredByPrefix}{" "}
          <a href="https://asooo2001.github.io/my-portfolio/" target="_blank" rel="noopener noreferrer" className="text-cyan-glow">
            Argjend Sokoli
          </a>.
        </p>
        <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1" aria-label="Legal">
          <Link href="/privacy-policy" className="transition-colors hover:text-cyan-glow">
            Privacy Policy
          </Link>
          <span aria-hidden="true">&middot;</span>
          <Link href="/terms-of-service" className="transition-colors hover:text-cyan-glow">
            Terms of Service
          </Link>
          <span aria-hidden="true">&middot;</span>
          <Link href="/refund-policy" className="transition-colors hover:text-cyan-glow">
            Refund Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function FacebookIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
