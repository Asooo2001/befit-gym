"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, Receipt } from "lucide-react";
import QRCode from "react-qr-code";
import { useLanguage } from "./LanguageProvider";

export type BankDetail = {
  key: "Response" | "Auth Code" | "Return Code" | "Order ID";
  value: string;
};

type MemberData = {
  phone: string;
  fullName: string;
  membershipId: string;
  tierName: string;
};

const MAX_POLL_ATTEMPTS = 15; // 30 seconds at 2 s intervals

export default function CheckoutSuccessView({
  bankDetails,
  orderId,
}: {
  bankDetails: BankDetail[];
  orderId?: string;
}) {
  const { t } = useLanguage();
  const s = t.checkout.success;

  const [confirmed, setConfirmed] = useState(!orderId);
  const [memberData, setMemberData] = useState<MemberData | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/checkout/transaction-status?orderId=${encodeURIComponent(orderId)}`
        );
        if (res.ok) {
          const body: { status: string; memberData?: MemberData | null } = await res.json();
          if (body.status === "completed" || body.status === "failed") {
            if (body.memberData) setMemberData(body.memberData);
            setConfirmed(true);
            clearInterval(timer);
            return;
          }
        }
      } catch {
        // network hiccup — keep polling
      }

      attempts++;
      if (attempts >= MAX_POLL_ATTEMPTS) {
        setConfirmed(true);
        clearInterval(timer);
      }
    };

    const timer = setInterval(poll, 2000);
    poll();

    return () => clearInterval(timer);
  }, [orderId]);

  if (!confirmed) {
    return (
      <section className="relative bg-obsidian py-24">
        <div className="mx-auto w-full max-w-2xl px-6">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-cyan-glow/40 bg-white/5 p-10 text-center backdrop-blur-sm shadow-[0_0_64px_-12px_var(--color-cyan-glow)]">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow shadow-[0_0_32px_-6px_var(--color-cyan-glow)]">
              <Loader2 className="h-9 w-9 animate-spin" strokeWidth={1.75} />
            </span>
            <p className="text-sm text-silver">{s.confirming}</p>
          </div>
        </div>
      </section>
    );
  }

  const qrValue = memberData
    ? `BEFIT|${memberData.phone}|${memberData.membershipId}`
    : null;

  return (
    <section className="relative bg-obsidian py-24">
      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-cyan-glow/40 bg-white/5 p-10 text-center backdrop-blur-sm shadow-[0_0_64px_-12px_var(--color-cyan-glow)]">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow shadow-[0_0_32px_-6px_var(--color-cyan-glow)]">
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
          </span>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
              {s.badge}
            </span>
            <h1 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
              {s.titleStart}
              <span className="text-gradient-electric">{s.titleHighlight}</span>
            </h1>
          </div>

          {bankDetails.length > 0 && (
            <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">{s.bankConfirmation}</p>
              <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {bankDetails.map((detail) => (
                  <div key={detail.key} className="flex items-baseline justify-between gap-3 sm:justify-start">
                    <dt className="text-sm text-silver">{s.detailLabels[detail.key]}</dt>
                    <dd className="font-mono text-sm text-foreground">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {qrValue && (
            <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-cyan-glow/30 bg-white/5 p-6">
              <div className="rounded-xl bg-white p-3 shadow-[0_0_32px_-6px_var(--color-cyan-glow)]">
                <QRCode
                  value={qrValue}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#0a0a0f"
                  level="M"
                />
              </div>
              <p className="font-mono text-[11px] break-all text-silver">{qrValue}</p>
            </div>
          )}

          <div className="flex w-full items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 text-left">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-glow">
              <Receipt className="h-4.5 w-4.5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground">{s.oneLastStep}</p>
              <p className="mt-1 text-sm leading-relaxed text-silver">
                {s.descriptionPrefix}
                <span className="inline-flex items-center gap-1 text-foreground">
                  <MapPin className="h-4 w-4 text-cyan-glow" strokeWidth={1.75} />
                  {s.locationLabel}
                </span>
                {s.descriptionSuffix}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-electric px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
          >
            {s.backToHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
