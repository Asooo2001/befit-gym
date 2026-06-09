"use client";

import { Dumbbell, Users, Maximize } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const ICONS = [Dumbbell, Users, Maximize];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="relative bg-obsidian py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
            {t.features.badge}
          </span>
          <h2 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            {t.features.titleStart}
            <span className="text-gradient-electric">{t.features.titleHighlight}</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.features.items.map(({ title, description }, index) => {
            const Icon = ICONS[index];
            return (
              <div
                key={title}
                className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-cyan-glow/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-silver">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
