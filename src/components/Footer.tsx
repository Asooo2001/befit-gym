"use client";

import Image from "next/image";
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
    { href: "#gallery", label: t.nav.gallery },
     { href: "#memberships", label: t.nav.memberships },
    { href: "#features", label: t.nav.features },
    { href: "#location", label: t.nav.location },
  ];

  return (
    <footer className="border-t border-white/10 bg-obsidian">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center sm:items-start">
          <Link href="/"  className="-my-8 flex items-center">
            <Image
              src="/transparent-image.svg"
              alt="Be Fit Gym"
              width={160}
              height={80}
              className="h-40 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <nav className="flex flex-col gap-2">
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

          <nav className="flex flex-col gap-2" aria-label="Legal">
            <Link href="/privacy-policy" className="text-sm font-medium text-silver transition-colors hover:text-cyan-glow">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm font-medium text-silver transition-colors hover:text-cyan-glow">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-sm font-medium text-silver transition-colors hover:text-cyan-glow">
              Refund Policy
            </Link>
          </nav>
        </div>

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
      </div>
    </footer>
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
