"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Pen, Music, BookOpen, FileText, Users2, Star, Heart, Mic, ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SanityDivisi, SanityHomePage } from "@/sanity/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Pen, Music, BookOpen, FileText, Users2, Star, Heart, Mic,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

function DivisionCard({ div, i }: { div: SanityDivisi; i: number }) {
  const Icon = ICON_MAP[div.ikon] ?? Pen;
  const accent = div.accent || "#059669";

  return (
    <motion.div {...fadeUp(i * 0.1)} className="group cursor-pointer">
      <Card
        className="relative overflow-hidden rounded-3xl border-0 shadow-[0_4px_24px_rgba(0,0,0,0.10)]"
        style={{ height: 340 }}
      >
        {div.imageUrl ? (
          <Image
            src={div.imageUrl}
            alt={div.nama}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: accent }} />
        )}

        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${accent}bb 0%, ${accent}f0 100%)` }}
        />

        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-xl border border-white/35">
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/80">
                {div.subtitle}
              </span>
            </div>

            {div.jumlahAnggota > 0 && (
              <Badge className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 h-auto text-[13px] font-semibold text-white border-white/35 bg-white/20 backdrop-blur-xl">
                <Users size={13} className="text-white" />
                {div.jumlahAnggota} Anggota
              </Badge>
            )}
          </div>

          <div>
            <h3
              className="font-bold text-[30px] text-white leading-[1.15] mb-2"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
            >
              {div.nama}
            </h3>
            <p className="text-[13px] text-white/82 leading-relaxed mb-4">
              {div.deskripsi}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white cursor-pointer transition-all duration-300 group-hover:gap-3 bg-white/20 backdrop-blur-[10px] border border-white/40">
              Pelajari Lebih Lanjut
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-[55%] -skew-x-12 pointer-events-none z-20 -translate-x-full group-hover:translate-x-[310%] transition-transform duration-750 ease-in-out"
          style={{
            background:
              "linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.14) 60%, transparent 90%)",
          }}
        />
        <div className="absolute inset-0 rounded-3xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.45), inset 0 1px 0 rgba(255,255,255,0.60)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/50" />
      </Card>
    </motion.div>
  );
}

type Props = {
  items: SanityDivisi[]
  home: SanityHomePage | null
}

export default function DivisionsSection({ items, home }: Props) {
  const heading = home?.divisions?.heading ?? "Jelajahi Cabang Seni Religi"
  const subheading = home?.divisions?.subheading ?? "Temukan passion Anda melalui berbagai divisi seni yang dirancang untuk mengasah kreativitas dan memperdalam spiritualitas."

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 50%, #e8f5ec 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
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
            {heading}
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[16px] text-neutral-500 max-w-xl mx-auto leading-relaxed">
            {subheading}
          </motion.p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {items.map((div, i) => (
              <DivisionCard key={div._id} div={div} i={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400 text-[14px]">Belum ada divisi yang ditambahkan.</p>
        )}
      </div>
    </section>
  );
}
