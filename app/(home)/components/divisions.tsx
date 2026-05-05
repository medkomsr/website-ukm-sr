"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/data";

const wiv = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const divisions = [
  {
    title: "Kaligrafi",
    subtitle: "Seni Tulis Arab",
    desc: "Pelajari teknik menulis indah huruf Arab dari gaya Naskhi hingga Tsuluts.",
    img: IMAGES.calligraphy,
    members: 42,
  },
  {
    title: "Nasyid",
    subtitle: "Vokal Islami",
    desc: "Ekspresikan keindahan melalui harmoni musik dan vokal group islami.",
    img: IMAGES.stage,
    members: 35,
  },
  {
    title: "Tilawah",
    subtitle: "Seni Baca Al-Quran",
    desc: "Asah kemampuan tilawah dengan tajwid sempurna dan suara yang memukau.",
    img: IMAGES.quran,
    members: 28,
  },
  {
    title: "Puisi & Sastra",
    subtitle: "Karya Tulis Religi",
    desc: "Tuangkan renungan spiritual melalui rangkaian kata-kata puitis bermakna.",
    img: IMAGES.writing,
    members: 25,
  },
  {
    title: "Humas",
    subtitle: "Hubungan Masyarakat",
    desc: "Jembatan komunikasi UKM dengan publik dan instansi luar kampus.",
    img: IMAGES.community,
    members: 18,
  },
];

type Division = (typeof divisions)[number];

function DivisionCard({ div, delay = 0 }: { div: Division; delay?: number }) {
  return (
    <motion.div
      {...wiv(delay)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ height: 380 }}
    >
      {/* Photo */}
      <Image
        src={div.img}
        alt={div.title}
        fill
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
        {/* Top: category + count */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white/50">
            {div.subtitle}
          </span>
          <span className="text-[11px] font-medium text-white/38 tabular-nums">
            {div.members} anggota
          </span>
        </div>

        {/* Bottom: title + desc + cta */}
        <div>
          <h3
            className="text-[30px] font-bold text-white leading-[1.2] mb-2.5 transition-colors duration-300 group-hover:text-amber-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {div.title}
          </h3>
          <p className="text-[13px] text-white/58 leading-relaxed mb-5 line-clamp-2">
            {div.desc}
          </p>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white/42 transition-colors duration-300 group-hover:text-amber-400">
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
    </motion.div>
  );
}

function DivisionCardWide({ div, delay = 0 }: { div: Division; delay?: number }) {
  return (
    <motion.div
      {...wiv(delay)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ height: 200 }}
    >
      {/* Photo */}
      <Image
        src={div.img}
        alt={div.title}
        fill
        className="object-cover transition-transform duration-700"
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      />

      {/* Left-to-right gradient for horizontal layout */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(7,22,13,0.97) 0%, rgba(7,22,13,0.82) 35%, rgba(7,22,13,0.35) 58%, rgba(7,22,13,0.06) 100%)",
        }}
      />

      <div className="absolute inset-0 px-8 py-7 flex flex-col justify-center" style={{ maxWidth: 480 }}>
        <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white/50 mb-3">
          {div.subtitle}
        </span>
        <h3
          className="text-[28px] font-bold text-white leading-tight mb-2 transition-colors duration-300 group-hover:text-amber-400"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {div.title}
        </h3>
        <p className="text-[13px] text-white/58 leading-relaxed mb-4">
          {div.desc}
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white/42 transition-colors duration-300 group-hover:text-amber-400">
          Pelajari lebih lanjut
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>

      {/* Member count — bottom right */}
      <span
        className="absolute bottom-7 right-8 text-[11px] font-medium text-white/35 tabular-nums"
      >
        {div.members} anggota
      </span>

      {/* Gold accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: "#F59E0B" }}
      />
    </motion.div>
  );
}

export default function DivisionsSection() {
  const mainDivisions = divisions.slice(0, 4);
  const wideDivision = divisions[4];

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

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {mainDivisions.map((div, i) => (
            <DivisionCard key={div.title} div={div} delay={i * 0.08} />
          ))}
          <div className="sm:col-span-2">
            <DivisionCardWide div={wideDivision} delay={0.32} />
          </div>
        </div>
      </div>
    </section>
  );
}
