"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Award, ArrowRight, Building2, MapPin, Newspaper } from "lucide-react";
import { usePrestasi, useFeaturedPrestasi } from "@/hooks/usePrestasi";
import type { SanityPrestasi } from "@/sanity/types";

// ─── Constants & Configuration ──────────────────────────────────────────────

type Category = SanityPrestasi["category"];

const CATEGORY_STYLE: Record<Category, { color: string; bg: string }> = {
  Kompetisi: { color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  Penghargaan: { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  Kolaborasi: { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  "Rekam Jejak": { color: "#86efac", bg: "rgba(134,239,172,0.12)" },
};

const POSITION_STYLE: Record<string, { bg: string; color: string }> = {
  "Juara 1": { bg: "linear-gradient(135deg,#b45309,#d97706)", color: "white" },
  "Juara 2": { bg: "linear-gradient(135deg,#6b7280,#9ca3af)", color: "white" },
  "Juara 3": { bg: "linear-gradient(135deg,#92400e,#b45309)", color: "white" },
};

// ─── Reusable Components ────────────────────────────────────────────────────

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Sub-sections ───────────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <div className="mb-10">
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold text-(--color-maroon-500)"
      >
        Prestasi
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="text-[30px] md:text-[42px] leading-tight font-bold text-[#0d2a1a]"
      >
        Rekam Jejak <span className="text-(--color-maroon-500)">Pencapaian Kami</span>
      </motion.h2>
    </div>
  );
}

function StatsStrip({ items }: { items: SanityPrestasi[] }) {
  const statsList = [
    { icon: Trophy, label: "Total Prestasi", value: items.length, suffix: "+" },
    { icon: Medal, label: "Tingkat Nasional", value: items.filter((a) => a.level === "Nasional" || a.level === "Internasional").length, suffix: "" },
    { icon: Award, label: "Cabang Kompetisi", value: items.filter((a) => a.category === "Kompetisi").length, suffix: "" },
    { icon: Star, label: "Juara 1", value: items.filter((a) => a.position === "Juara 1").length, suffix: "×" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-2 md:grid-cols-4 rounded-3xl overflow-hidden mb-10"
      style={{
        background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 50%, #0d2a1a 100%)",
        boxShadow: "0 12px 40px rgba(13,42,26,0.20)",
      }}
    >
      {statsList.map(({ icon: Icon, label, value, suffix }, i) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center py-6 px-4 text-center relative border-r border-white/5 last:border-0"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-amber-500/10">
            <Icon size={18} className="text-[#F59E0B]" />
          </div>
          <div className="text-[30px] md:text-[36px] font-extrabold leading-none text-white mb-1">
            <Counter target={value} suffix={suffix} />
          </div>
          <div className="text-[11px] font-medium text-white/50">
            {label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function AchievementCard({ item, delay }: { item: SanityPrestasi; delay: number }) {
  const pos = item.position ? (POSITION_STYLE[item.position] ?? null) : null;
  const noPos = item.position && !pos;
  const cat = CATEGORY_STYLE[item.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className="relative rounded-3xl overflow-hidden group hover:shadow-2xl transition-shadow duration-500 h-full flex flex-col"
      style={{
        background: "linear-gradient(145deg, #0f3020 0%, #1c5035 55%, #0d2a1a 100%)",
        boxShadow: "0 8px 32px rgba(13,42,26,0.22)",
      }}
    >
      {/* Decorative Accents */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-amber-500 to-transparent" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/element-islamic.png')] bg-cover" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(245,158,11,0.09) 0%, transparent 65%)" }} />
      <div
        className="absolute top-0 bottom-0 w-[55%] -skew-x-12 pointer-events-none -translate-x-full group-hover:translate-x-[310%] transition-transform duration-700 ease-in-out z-10"
        style={{ background: "linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 60%, transparent 90%)" }}
      />
      <div className="absolute top-4 right-4 z-20 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <Newspaper size={14} className="text-[#F59E0B]" />
      </div>

      {/* Card Content */}
      <div className="relative flex flex-col flex-1 p-6 z-10">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pr-8">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: cat?.bg ?? "rgba(255,255,255,0.1)", color: cat?.color ?? "rgba(255,255,255,0.8)" }}>
            {item.category}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/60">
            {item.year}
          </span>
          <span className="ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
            {item.level}
          </span>
        </div>

        {/* Position */}
        {pos && (
          <div className="self-start inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-xl" style={{ background: pos.bg, color: pos.color }}>
            <Medal size={12} />
            <span className="text-[12px] font-bold">{item.position}</span>
          </div>
        )}
        {noPos && (
          <div className="self-start inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-500">
            <Award size={12} />
            <span className="text-[12px] font-semibold">{item.position}</span>
          </div>
        )}

        {/* Title & Description */}
        <h3 className="group-hover:text-amber-300 transition-colors duration-300 font-bold text-[16px] text-white leading-[1.4] mb-2.5">
          {item.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-[13px] text-white/60 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-white/10">
          <div className="flex flex-col gap-1.5 mb-3 text-[12px] text-white/40">
            <span className="flex items-center gap-1.5">
              <Building2 size={11} />
              <span className="line-clamp-1">{item.organizer}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} />
              {item.location}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-white/5 group-hover:gap-3 transition-all duration-300 text-[#F59E0B]">
            <Newspaper size={13} />
            <span className="text-[12px] font-semibold">Baca Berita Selengkapnya</span>
            <ArrowRight size={13} className="-translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BottomCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mt-10 text-center"
    >
      <Link
        href="/prestasi"
        className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[14px] font-bold no-underline transition-all duration-300 hover:brightness-110 active:scale-95 group"
        style={{
          background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)",
          color: "#F59E0B",
          boxShadow: "0 8px 28px rgba(13,42,26,0.25)",
        }}
      >
        <Trophy size={16} />
        Lihat Rekam Jejak Lengkap
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PrestasiPreviewSection() {
  const { data: allPrestasi } = usePrestasi();
  const { data: featuredData } = useFeaturedPrestasi();

  const items = allPrestasi ?? [];
  const featured = (featuredData ?? []).slice(0, 3);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #f9f7ef 0%, #ede8d4 100%)" }}>
      {/* Decorative radial glows */}
      <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(13,42,26,0.06) 0%, transparent 65%)" }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(153,27,27,0.05) 0%, transparent 65%)" }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <SectionHeader />

        <StatsStrip items={items} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((item, i) => (
            <AchievementCard key={item._id} item={item} delay={i * 0.1} />
          ))}
        </div>

        <BottomCTA />
      </div>
    </section>
  );
}
