"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Pen, Music, BookOpen, FileText, Users2, ArrowRight, Users } from "lucide-react";
import { IMAGES } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const divisions = [
  {
    icon: Pen,
    title: "Kaligrafi",
    subtitle: "Seni Tulis Arab",
    desc: "Pelajari teknik menulis indah huruf Arab dari gaya Naskhi hingga Tsuluts.",
    img: IMAGES.calligraphy,
    members: 42,
    accent: "#059669",
  },
  {
    icon: Music,
    title: "Nasyid",
    subtitle: "Vokal Islami",
    desc: "Ekspresikan keindahan melalui harmoni musik dan vokal group islami.",
    img: IMAGES.stage,
    members: 35,
    accent: "#0d6b2e",
  },
  {
    icon: BookOpen,
    title: "Tilawah",
    subtitle: "Seni Baca Al-Quran",
    desc: "Asah kemampuan tilawah dengan tajwid sempurna dan suara yang memukau.",
    img: IMAGES.quran,
    members: 28,
    accent: "#0d7a6e",
  },
  {
    icon: FileText,
    title: "Puisi & Sastra",
    subtitle: "Karya Tulis Religi",
    desc: "Tuangkan renungan spiritual melalui rangkaian kata-kata puitis bermakna.",
    img: IMAGES.writing,
    members: 25,
    accent: "#4d7c0f",
  },
  {
    icon: Users2,
    title: "Humas",
    subtitle: "Hubungan Masyarakat",
    desc: "Jembatan komunikasi UKM dengan publik dan instansi luar kampus.",
    img: IMAGES.community,
    members: 18,
    accent: "#0d2a1a",
  },
];

// Named type — avoids verbose inline `(typeof divisions)[number]`
type Division = (typeof divisions)[number];

function DivisionCard({ div, i }: { div: Division; i: number }) {
  const Icon = div.icon;
  return (
    <motion.div {...fadeUp(i * 0.1)} className="group cursor-pointer">
      <Card
        className="relative overflow-hidden rounded-3xl border-0 shadow-[0_4px_24px_rgba(0,0,0,0.10)]"
        style={{ height: 340 }}
      >
        {/* Full-bleed photo */}
        <Image
          src={div.img}
          alt={div.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Colored tint overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${div.accent}bb 0%, ${div.accent}f0 100%)` }}
        />

        {/* Card content */}
        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between">
            {/* Icon box + subtitle */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-xl border border-white/35">
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/80">
                {div.subtitle}
              </span>
            </div>

            {/* Member count — shadcn Badge */}
            <Badge
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 h-auto text-[13px] font-semibold text-white border-white/35 bg-white/20 backdrop-blur-xl"
            >
              <Users size={13} className="text-white" />
              {div.members} Anggota
            </Badge>
          </div>

          {/* Bottom content */}
          <div>
            <h3
              className="font-bold text-[30px] text-white leading-[1.15] mb-2"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
            >
              {div.title}
            </h3>
            <p className="text-[13px] text-white/82 leading-relaxed mb-4">
              {div.desc}
            </p>

            {/* Glass CTA button */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white cursor-pointer transition-all duration-300 group-hover:gap-3 bg-white/20 backdrop-blur-[10px] border border-white/40"
            >
              Pelajari Lebih Lanjut
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* Metallic glass sheen */}
        <div
          className="absolute top-0 bottom-0 w-[55%] -skew-x-12 pointer-events-none z-20 -translate-x-full group-hover:translate-x-[310%] transition-transform duration-750 ease-in-out"
          style={{
            background:
              "linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.14) 60%, transparent 90%)",
          }}
        />

        {/* Edge ring on hover */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.45), inset 0 1px 0 rgba(255,255,255,0.60)" }}
        />

        {/* Bottom-edge glow on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/50" />
      </Card>
    </motion.div>
  );
}

export default function DivisionsSection() {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 50%, #e8f5ec 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            {...fadeUp(0)}
            className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold"
            style={{ color: "var(--color-maroon-500)" }}
          >
            Program Kami
          </motion.span>
          <motion.h2
            {...fadeUp(0.1)}
            className="text-[30px] md:text-[42px] text-(--color-neutral-1000) mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Jelajahi Cabang <span style={{ color: "var(--color-maroon-500)" }}>Seni Religi</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[16px] text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Temukan passion Anda melalui berbagai divisi seni yang dirancang untuk mengasah kreativitas dan memperdalam spiritualitas.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {divisions.map((div, i) => (
            <DivisionCard key={div.title} div={div} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
