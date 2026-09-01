import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CatalogHeader() {
  return (
    <section
      className="relative overflow-hidden border-b border-amber-900/10 bg-[#f8f3d8] pb-14 pt-12 md:pb-16 md:pt-14"
      aria-labelledby="catalog-title"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-40 size-96 rounded-full border border-amber-700/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-8 -top-24 size-72 rounded-full border border-amber-700/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-neutral-400">
          <Link
            href="/"
            className="transition-colors hover:text-(--color-maroon-600)"
          >
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-neutral-600">
            Katalog Kaligrafi
          </span>
        </nav>

        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-700/15 bg-white/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-(--color-maroon-700)">
            <Sparkles aria-hidden="true" className="size-3.5 text-amber-500" />
            Karya Seni Religi
          </div>
          <h1
            id="catalog-title"
            className="mb-3 text-[34px] leading-tight text-(--color-neutral-1000) md:text-[46px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Katalog Kaligrafi
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600 md:text-base">
            Temukan karya kaligrafi pilihan dari UKM Seni Religi. Pilih karya
            yang Anda sukai, lalu hubungi kami untuk menanyakan ketersediaannya.
          </p>
        </div>
      </div>
    </section>
  );
}
