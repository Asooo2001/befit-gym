"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const GALLERY_IMAGES = [
  "/gallery-1.avif",
  "/gallery-2.jpg",
  "/gallery-3.jpg",
  "/gallery-4.webp",
  "/gallery-5.avif",
  "/gallery-6.jpg",
];

function GalleryTile({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {errored ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-silver">
          <Camera className="h-8 w-8 opacity-40" strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-wider opacity-60">
            {t.gallery.placeholder}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          onError={() => setErrored(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>
  );
}

export default function GallerySection() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="relative bg-obsidian py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow backdrop-blur-sm">
            {t.gallery.badge}
          </span>
          <h2 className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            {t.gallery.titleStart}
            <span className="text-gradient-electric">{t.gallery.titleHighlight}</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY_IMAGES.map((src, index) => (
            <GalleryTile key={src} src={src} alt={`Be Fit Gym ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
