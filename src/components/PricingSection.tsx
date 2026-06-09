"use client";

import { Check } from "lucide-react";
import { useJoinModal } from "./JoinModalProvider";
import { useLanguage } from "./LanguageProvider";

const PLAN_DEFS = [
  { name: "Basic", price: "29", featured: false },
  { name: "Premium", price: "49", featured: true },
  { name: "VIP", price: "79", featured: false },
] as const;

export default function PricingSection() {
  const { openJoinModal } = useJoinModal();
  const { t } = useLanguage();

  return (
    <section id="memberships" className="relative bg-obsidian py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
            {t.pricing.badge}
          </span>
          <h2 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            {t.pricing.titleStart}
            <span className="text-gradient-electric">{t.pricing.titleHighlight}</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {PLAN_DEFS.map((plan) => {
            const planCopy = t.pricing.plans[plan.name];
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col gap-6 rounded-2xl border p-8 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "border-cyan-glow/60 bg-white/5 shadow-[0_0_48px_-12px_var(--color-cyan-glow)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-electric px-4 py-1 text-xs font-semibold uppercase tracking-wide text-obsidian">
                    {t.pricing.mostPopular}
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver">{planCopy.description}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-foreground">€{plan.price}</span>
                  <span className="text-sm text-silver">{t.pricing.perMonth}</span>
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {planCopy.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-silver">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={2} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openJoinModal(plan.name)}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-transform duration-300 hover:scale-105 ${
                    plan.featured
                      ? "bg-gradient-electric text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)]"
                      : "border border-white/20 text-foreground hover:border-cyan-glow hover:text-cyan-glow"
                  }`}
                >
                  {t.pricing.choosePrefix} {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
