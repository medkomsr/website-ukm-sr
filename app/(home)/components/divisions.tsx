"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BIDANG_DATA } from "@/lib/bidang-data";

const wiv = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
});

// Tampilkan 3 bidang unggulan di homepage — sisanya bisa dilihat di /tentang#bidang-seni
const FEATURED_SLUGS = ["banjari-nasyid", "khattil-quran", "ttq"] as const;

// Subtitle/kategori singkat per bidang untuk label kecil di kartu
const SUBTITLE_MAP: Record<string, string> = {
  "banjari-nasyid": "Musik Vokal Islami",
  "khattil-quran": "Seni Tulis Al-Qur'an",
  "hifdzil-quran": "Hafalan Al-Qur'an",
  "syarhil-quran": "Tafsir Komunikatif",
  "fahmil-quran": "Cerdas-Cermat Qur'ani",
  dia: "Debat Ilmiah",
  ktdaq: "Riset & Inovasi Qur'ani",
  ttq: "Seni Baca Al-Qur'an",
};

// Deskripsi pendek (1 kalimat) untuk kartu — diambil dari deskripsi panjang via shorter excerpt
const SHORT_DESC: Record<string, string> = {
  "banjari-nasyid": "Padukan irama hadrah & harmoni nasyid dalam pentas seni musik islami yang siap pentas dan kompetisi.",
  "khattil-quran": "Tulis ayat-ayat Al-Qur'an dengan gaya Naskhi, Tsuluts, Diwani, hingga Kufi yang memukau.",
  "ttq": "Bacakan Al-Qur'an dengan maqamat indah—Bayati, Hijaz, Nahawand—dan kaidah tajwid yang sempurna.",
};

type Division = {
  slug: string;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
};

const divisions: Division[] = FEATURED_SLUGS.map((slug) => {
  const b = BIDANG_DATA[slug];
  return {
    slug,
    title: b.fullName,
    subtitle: SUBTITLE_MAP[slug] ?? b.heading,
    desc: SHORT_DESC[slug] ?? b.description,
    img: b.img,
  };
});

function DivisionCard({ div, delay = 0 }: { div: Division; delay?: number }) {
  return (
    <motion.div {...wiv(delay)}>
      <Link
        href={`/tentang/bidang/${div.slug}`}
        className="group relative block overflow-hidden rounded-2xl no-underline"
        style={{ height: 380 }}
      >
        {/* Photo */}
        <Image
          src={div.img}
          alt={div.title}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        />

        {/* Bottom-focused gradient — keeps photo visible at top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(7,22,13,0.97) 0%, rgba(7,22,13,0.80) 30%, rgba(7,22,13,0.28) 55%, rgba(7,22,13,0.06) 100%)",
          }}
        />

        {/* Top micro-vignette for label readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(7,22,13,0.38) 0%, transparent 20%)",
          }}
        />

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top: category label */}
          <div>
            <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white/55">
              {div.subtitle}
            </span>
          </div>

          {/* Bottom: title + desc + cta */}
          <div>
            <h3
              className="text-[26px] md:text-[28px] font-bold text-white leading-[1.2] mb-2.5 transition-colors duration-300 group-hover:text-amber-400"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {div.title}
            </h3>
            <p className="text-[13px] text-white/60 leading-relaxed mb-5 line-clamp-2">
              {div.desc}
            </p>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white/45 transition-colors duration-300 group-hover:text-amber-400">
              Pelajari lebih lanjut
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>

        {/* Gold accent line — slides in from left on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: "#F59E0B" }}
        />
      </Link>
    </motion.div>
  );
}


export default function DivisionsSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: "#f7fbf8" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            {...wiv(0)}
            className="inline-block text-[12px] tracking-[0.22em] uppercase mb-4 font-bold"
            style={{ color: "var(--color-maroon-500)" }}
          >
            Program Kami
          </motion.span>
          <motion.h2
            {...wiv(0.08)}
            className="text-[30px] md:text-[42px] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#0d2a1a" }}
          >
            Jelajahi Cabang{" "}
            <span style={{ color: "var(--color-maroon-500)" }}>Seni Religi</span>
          </motion.h2>
          <motion.p
            {...wiv(0.14)}
            className="text-[16px] text-neutral-500 max-w-xl mx-auto leading-relaxed"
          >
            Temukan passion Anda melalui berbagai divisi seni yang dirancang untuk mengasah
            kreativitas dan memperdalam spiritualitas.
          </motion.p>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {divisions.map((div, i) => (
            <DivisionCard key={div.title} div={div} delay={i * 0.08} />
          ))}
        </div>

        {/* CTA */}
        <motion.div {...wiv(0.28)} className="flex justify-center mt-10">
          <Link
            href="/tentang#bidang-seni"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 group"
            style={{
              border: "1.5px solid #0d2a1a",
              color: "#0d2a1a",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#0d2a1a";
              el.style.color = "white";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "#0d2a1a";
            }}
          >
            Lihat Selengkapnya
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
