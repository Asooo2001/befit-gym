"use client";

import Image from "next/image";
import { useJoinModal } from "./JoinModalProvider";
import { useLanguage } from "./LanguageProvider";
import { getPackageById, type Gender } from "@/lib/membershipPlans";

const COLUMNS: { gender: Gender; image: string }[] = [
  { gender: "female", image: "/1109-woman-chest-press.webp" },
  { gender: "male", image: "/young-fitness-man-studio_7502-5004.avif" },
];

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

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {COLUMNS.map(({ gender, image }) => {
            const copy = t.pricing.genders[gender];
            const cheapestPrice = getPackageById(`${gender}-1day`)!.price;

            return (
              <div
                key={gender}
                className="group relative flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={image}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/10"
                />

                <div className="relative z-10 flex flex-col gap-4 p-8">
                  <h3 className="text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
                    {copy.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-silver">{copy.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow">
                    {t.pricing.startingFrom} €{cheapestPrice}
                  </p>

                  <button
                    type="button"
                    onClick={() => openJoinModal(gender)}
                    className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-electric px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
                  >
                    {t.pricing.joinNow}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
