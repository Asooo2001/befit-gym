"use client";

import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const WHATSAPP_NUMBER = "+38348367555";

export default function ContactSection() {
  const { t } = useLanguage();
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t.contact.whatsappMessage
  )}`;

  return (
    <section id="location" className="relative bg-obsidian py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
            {t.contact.badge}
          </span>
          <h2 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            {t.contact.titleStart}
            <span className="text-gradient-electric">{t.contact.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-silver">{t.contact.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow">
                <MapPin className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{t.contact.addressTitle}</h3>
                <p className="mt-1 text-sm leading-relaxed text-silver">{t.contact.addressValue}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow">
                <Clock className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{t.contact.hoursTitle}</h3>
                <ul className="mt-1 flex flex-col gap-1 text-sm text-silver">
                  {t.contact.hours.map((row) => (
                    <li
                      key={row.days}
                      className="flex items-center justify-between gap-6"
                    >
                      <span>{row.days}</span>
                      <span className="text-foreground/80">{row.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow">
                <Phone className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{t.contact.phoneTitle}</h3>
                <p className="mt-1 text-sm text-silver">+383 48 367 555</p>
              </div>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-8px_#25D366] transition-transform duration-300 hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} />
              {t.contact.whatsappCta}
            </a>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.3955225739155!2d20.831069111688954!3d42.36296247107245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13539b004d2dac09%3A0x9fe0b1aaf5254663!2sBE%20FIT%20Gym!5e1!3m2!1sen!2snl!4v1780923388728!5m2!1sen!2snl"
              className="h-full min-h-[320px] w-full "
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t.contact.mapTitle}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
