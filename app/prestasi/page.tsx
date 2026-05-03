"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Handshake, BookMarked,
  MapPin, Building2, ChevronRight, ArrowRight,
  Medal, Award, Users, Calendar, Newspaper,
} from "lucide-react";
import SiteLayout from "@/components/site-layout";
import {
  achievements,
  Achievement,
  AchievementCategory,
  AchievementLevel,
} from "@/lib/data";

// ─── Config ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<AchievementCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  Kompetisi:    { label: "Kompetisi",   icon: Trophy,     color: "#991b1b", bg: "#fef2f2" },
  Penghargaan:  { label: "Penghargaan", icon: Star,       color: "#d97706", bg: "#fffbeb" },
  Kolaborasi:   { label: "Kolaborasi",  icon: Handshake,  color: "#0d7a6e", bg: "#f0fdfa" },
  "Rekam Jejak":{ label: "Rekam Jejak", icon: BookMarked, color: "#4d7c0f", bg: "#f7fee7" },
};

const LEVEL_CONFIG: Record<AchievementLevel, { color: string; bg: string; ring: string }> = {
  Kampus:         { color: "#525252", bg: "#f5f5f5",  ring: "#d4d4d4" },
  Kota:           { color: "#0369a1", bg: "#eff6ff",  ring: "#bfdbfe" },
  Provinsi:       { color: "#059669", bg: "#f0fdf4",  ring: "#bbf7d0" },
  Nasional:       { color: "#b45309", bg: "#fffbeb",  ring: "#fde68a" },
  Internasional:  { color: "#991b1b", bg: "#fef2f2",  ring: "#fecaca" },
};

const POSITION_STYLE: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
  "Juara 1": { bg: "linear-gradient(135deg,#b45309,#d97706)", color: "white", icon: Medal },
  "Juara 2": { bg: "linear-gradient(135deg,#6b7280,#9ca3af)", color: "white", icon: Medal },
  "Juara 3": { bg: "linear-gradient(135deg,#92400e,#b45309)", color: "white", icon: Medal },
};

// ─── Animated Counter ───────────────────────────────────────────────────────

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

// ─── Achievement Card ───────────────────────────────────────────────────────

function AchievementCard({ item, delay = 0 }: { item: Achievement; delay?: number }) {
  const cat = CATEGORY_CONFIG[item.category];
  const lv  = LEVEL_CONFIG[item.level];
  const pos = item.position ? POSITION_STYLE[item.position] : null;
  const CatIcon = cat.icon;
  const PosIcon = pos ? pos.icon : Award;
  const hasArticle = !!item.articleId;

  const cardBody = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col h-full"
      style={{
        borderColor: hasArticle ? undefined : undefined,
        cursor: hasArticle ? "pointer" : "default",
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cat.color}99 0%, ${cat.color} 60%, transparent 100%)` }} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Badge row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ background: cat.bg, color: cat.color }}
          >
            <CatIcon size={11} />
            {cat.label}
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full border ml-auto"
            style={{ background: lv.bg, color: lv.color, borderColor: lv.ring }}
          >
            {item.level}
          </span>
          <Newspaper size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: "#b45309" }} />
        </div>

        {/* Position ribbon */}
        {pos && (
          <div
            className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-bold"
            style={{ background: pos.bg, color: pos.color }}
          >
            <PosIcon size={12} />
            {item.position}
          </div>
        )}
        {item.position && !pos && (
          <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold"
            style={{ background: "#fef2f2", color: "#991b1b" }}>
            <Award size={12} />
            {item.position}
          </div>
        )}

        {/* Title */}
        <h3
          className="text-[15px] font-bold leading-snug text-[var(--color-neutral-1000)] group-hover:text-[var(--color-maroon-500)] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-neutral-500 leading-relaxed line-clamp-3 flex-1">
          {item.description}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-100 mt-auto">
          <div className="flex items-start gap-1.5 text-[12px] text-neutral-400">
            <Building2 size={12} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{item.organizer}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-neutral-400">
            <MapPin size={12} className="flex-shrink-0" />
            <span>{item.location}</span>
          </div>

          {/* Baca Berita footer link */}
          {hasArticle && (
            <div
              className="flex items-center gap-1.5 pt-2 mt-1 group-hover:gap-2.5 transition-all duration-300"
              style={{ borderTop: "1px solid #fde68a" }}
            >
              <Newspaper size={12} style={{ color: "#b45309" }} />
              <span className="text-[12px] font-semibold" style={{ color: "#b45309" }}>
                Baca Berita Selengkapnya
              </span>
              <ArrowRight
                size={12}
                className="-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                style={{ color: "#b45309" }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (hasArticle) {
    return (
      <Link href={`/aktivitas/${item.articleId}`} className="no-underline flex flex-col h-full">
        {cardBody}
      </Link>
    );
  }

  return cardBody;
}

// ─── Featured Card ─────────────────────────────────────────────────────────

function FeaturedCard({ item, delay = 0 }: { item: Achievement; delay?: number }) {
  const cat = CATEGORY_CONFIG[item.category];
  const lv  = LEVEL_CONFIG[item.level];
  const CatIcon = cat.icon;
  const hasArticle = !!item.articleId;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: hasArticle ? -5 : 0, transition: { duration: 0.3 } }}
      className="relative rounded-3xl overflow-hidden group h-full"
      style={{
        background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 60%, #0d2a1a 100%)",
        boxShadow: "0 8px 40px rgba(13,42,26,0.25)",
        cursor: hasArticle ? "pointer" : "default",
      }}
    >
      {/* Islamic pattern watermark */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url("/element-islamic.png")`, backgroundSize: "cover" }}
      />

      {/* Gold shimmer top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #F59E0B, transparent)" }} />

      {/* Hover glow */}
      {hasArticle && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(245,158,11,0.07) 0%, transparent 60%)" }} />
      )}

      <div className="relative p-7 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <CatIcon size={11} />
            {cat.label}
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full border"
            style={{ background: lv.bg, color: lv.color, borderColor: lv.ring }}>
            {item.level}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }}>
            {item.year}
          </span>
          <Newspaper size={13} className="ml-auto opacity-60" style={{ color: "#F59E0B" }} />
        </div>

        {item.position && (
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-xl"
            style={{ background: "linear-gradient(135deg,#b45309,#d97706)", color: "white" }}>
            <Medal size={14} />
            <span className="text-[13px] font-bold">{item.position}</span>
          </div>
        )}

        <h3
          className="group-hover:text-amber-300 transition-colors duration-300"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", lineHeight: 1.35, marginBottom: 10 }}
        >
          {item.title}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 16 }}>
          {item.description}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            <Building2 size={12} />{item.organizer}
          </span>
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            <MapPin size={12} />{item.location}
          </span>
        </div>

        {/* Baca Berita CTA */}
        {hasArticle && (
          <div
            className="flex items-center gap-2 pt-4 group-hover:gap-3 transition-all duration-300"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Newspaper size={14} style={{ color: "#F59E0B" }} />
            <span className="text-[13px] font-semibold" style={{ color: "#F59E0B" }}>
              Baca Berita Selengkapnya
            </span>
            <ArrowRight
              size={14}
              className="-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
              style={{ color: "#F59E0B" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (hasArticle) {
    return (
      <Link href={`/aktivitas/${item.articleId}`} className="no-underline block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}

// ─── Page ───────────────────────────────────────────────────────────────────

const ALL_CATEGORIES: ("all" | AchievementCategory)[] = ["all", "Kompetisi", "Penghargaan", "Kolaborasi", "Rekam Jejak"];
const ALL_LEVELS: ("all" | AchievementLevel)[] = ["all", "Nasional", "Provinsi", "Kota", "Kampus"];

export default function PrestasiPage() {
  const [catFilter, setCatFilter]   = useState<"all" | AchievementCategory>("all");
  const [levelFilter, setLevelFilter] = useState<"all" | AchievementLevel>("all");

  // Only show achievements that have a linked article as proof
  const withArticle = useMemo(() => achievements.filter((a) => !!a.articleId), []);

  const featured = useMemo(() => withArticle.filter((a) => a.featured), [withArticle]);

  const filtered = useMemo(() => {
    let list = [...withArticle];
    if (catFilter   !== "all") list = list.filter((a) => a.category === catFilter);
    if (levelFilter !== "all") list = list.filter((a) => a.level    === levelFilter);
    return list;
  }, [catFilter, levelFilter, withArticle]);

  // Group by year descending
  const byYear = useMemo(() => {
    const map = new Map<number, Achievement[]>();
    for (const a of filtered) {
      if (!map.has(a.year)) map.set(a.year, []);
      map.get(a.year)!.push(a);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const stats = useMemo(() => ({
    total:     achievements.length,
    nasional:  achievements.filter((a) => a.level === "Nasional" || a.level === "Internasional").length,
    kompetisi: achievements.filter((a) => a.category === "Kompetisi").length,
    juara1:    achievements.filter((a) => a.position === "Juara 1").length,
  }), []);

  const hasFilter = catFilter !== "all" || levelFilter !== "all";

  return (
    <SiteLayout>
      {/* ── Hero ──────────────────────────────────────── */}
      <section
        className="pt-12 pb-16 relative overflow-hidden border-b border-neutral-200"
        style={{ background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 55%, #0d2a1a 100%)" }}
      >
        {/* Islamic watermark */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("/element-islamic.png")`, backgroundSize: "cover" }} />
        {/* Gold shimmer bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(90deg,transparent,#F59E0B 40%,transparent)" }} />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-white/40 mb-8">
            <Link href="/" className="text-white/40 hover:text-white/80 no-underline transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <span className="text-white/70">Prestasi</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-block text-[12px] font-bold tracking-[0.22em] uppercase mb-4"
              style={{ color: "#F59E0B" }}>
              Track Record
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px,5vw,48px)", color: "white", lineHeight: 1.2, maxWidth: 640, marginBottom: 16 }}>
              Rekam Jejak{" "}
              <span style={{ color: "#F59E0B" }}>Prestasi & Penghargaan</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.60)", maxWidth: 520, lineHeight: 1.75, marginBottom: 32 }}>
              Kumpulan pencapaian UKM Seni Religi Universitas Brawijaya dari 2020 hingga kini — bukti nyata komitmen kami dalam berkarya dan berprestasi di tingkat kampus, regional, hingga nasional.
            </p>

            {/* CTA for sponsors */}
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold no-underline transition-all duration-300 hover:brightness-110 active:scale-95"
              style={{ background: "linear-gradient(135deg,var(--color-maroon-600),var(--color-maroon-500))", color: "white" }}
            >
              Tertarik Berkolaborasi?
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Trophy, label: "Total Prestasi", value: stats.total, suffix: "+" },
              { icon: Medal,  label: "Tingkat Nasional", value: stats.nasional, suffix: "" },
              { icon: Award,  label: "Cabang Kompetisi", value: stats.kompetisi, suffix: "" },
              { icon: Star,   label: "Juara 1", value: stats.juara1, suffix: "×" },
            ].map(({ icon: Icon, label, value, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-100"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#fef2f2,#fde3e3)" }}>
                  <Icon size={20} style={{ color: "var(--color-maroon-500)" }} />
                </div>
                <div>
                  <div className="text-[26px] font-extrabold text-[var(--color-neutral-1000)] leading-none">
                    <Counter target={value} suffix={suffix} />
                  </div>
                  <div className="text-[12px] text-neutral-400 mt-0.5">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ──────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ background: "linear-gradient(135deg,#f9f9f3 0%,#f3f0e6 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
              Sorotan Utama
            </span>
            <h2 className="text-[22px] md:text-[28px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Pencapaian Unggulan
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((item, i) => (
              <FeaturedCard key={item.id} item={item} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
              Rekap Lengkap
            </span>
            <h2 className="text-[22px] md:text-[28px] mt-1 mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Semua Prestasi
            </h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {ALL_CATEGORIES.map((c) => {
                  const active = catFilter === c;
                  const cfg = c !== "all" ? CATEGORY_CONFIG[c as AchievementCategory] : null;
                  return (
                    <button
                      key={c}
                      onClick={() => setCatFilter(c)}
                      className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer border transition-all duration-200 inline-flex items-center gap-1.5"
                      style={{
                        fontWeight: active ? 700 : 500,
                        background: active ? (cfg ? cfg.color : "#0d2a1a") : "white",
                        color: active ? "white" : "#525252",
                        borderColor: active ? (cfg ? cfg.color : "#0d2a1a") : "#e5e5e5",
                      }}
                    >
                      {cfg && <cfg.icon size={11} />}
                      {c === "all" ? "Semua Kategori" : c}
                    </button>
                  );
                })}
              </div>

              {/* Level filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {ALL_LEVELS.map((l) => {
                  const active = levelFilter === l;
                  const lvcfg = l !== "all" ? LEVEL_CONFIG[l as AchievementLevel] : null;
                  return (
                    <button
                      key={l}
                      onClick={() => setLevelFilter(l)}
                      className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer border transition-all duration-200"
                      style={{
                        fontWeight: active ? 700 : 500,
                        background: active ? (lvcfg ? lvcfg.color : "#0d2a1a") : "white",
                        color: active ? "white" : "#525252",
                        borderColor: active ? (lvcfg ? lvcfg.ring : "#0d2a1a") : "#e5e5e5",
                      }}
                    >
                      {l === "all" ? "Semua Level" : l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result count */}
            <p className="text-[13px] text-neutral-400 mt-3">
              Menampilkan{" "}
              <span className="text-neutral-700 font-semibold">{filtered.length}</span> prestasi
              {hasFilter && (
                <button
                  onClick={() => { setCatFilter("all"); setLevelFilter("all"); }}
                  className="ml-3 text-[var(--color-maroon-500)] font-semibold cursor-pointer border-none bg-transparent text-[13px]"
                >
                  Reset filter
                </button>
              )}
            </p>
          </motion.div>

          {/* Year-grouped cards */}
          <AnimatePresence mode="wait">
            {byYear.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <Trophy size={40} className="mx-auto mb-4 text-neutral-200" />
                <p className="text-neutral-400 text-[15px]">Tidak ada prestasi yang sesuai filter.</p>
              </motion.div>
            ) : (
              <motion.div key={`${catFilter}-${levelFilter}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {byYear.map(([year, items]) => (
                  <div key={year} className="mb-12">
                    {/* Year divider */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-[15px]"
                        style={{ background: "linear-gradient(135deg,#0d2a1a,#1a4a2e)", color: "#F59E0B" }}>
                        {String(year).slice(2)}
                      </div>
                      <div>
                        <p className="text-[22px] font-extrabold text-[var(--color-neutral-1000)]">{year}</p>
                        <p className="text-[12px] text-neutral-400">{items.length} prestasi</p>
                      </div>
                      <div className="flex-1 h-px bg-neutral-100" />
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {items.map((item, i) => (
                        <AchievementCard key={item.id} item={item} delay={i * 0.06} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Sponsor CTA ───────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg,#fcfbe6 0%,#f6f1c8 50%,#f0eaa8 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
          >
            <span className="inline-block text-[12px] font-bold tracking-[0.22em] uppercase mb-3"
              style={{ color: "var(--color-maroon-500)" }}>
              Sponsorship &amp; Kemitraan
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px,4vw,36px)", color: "#0d2a1a", lineHeight: 1.3, marginBottom: 14 }}>
              Bergabung Bersama Kami,{" "}
              <span style={{ color: "var(--color-maroon-500)" }}>Wujudkan Dampak Nyata</span>
            </h2>
            <p style={{ fontSize: 15, color: "#525252", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.75 }}>
              Prestasi-prestasi di atas adalah bukti nyata kualitas dan konsistensi UKM Seni Religi UB.
              Bersama mitra dan sponsor, kami siap membawa seni Islam ke panggung yang lebih luas.
            </p>

            {/* Metrics row */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {[
                { icon: Users, label: "Anggota Aktif", value: "150+" },
                { icon: Calendar, label: "Tahun Berdiri", value: "11+" },
                { icon: Trophy, label: "Total Prestasi", value: `${achievements.length}+` },
                { icon: Medal, label: "Juara Nasional", value: `${achievements.filter(a => a.position === "Juara 1" && (a.level === "Nasional" || a.level === "Internasional")).length}×` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={18} style={{ color: "var(--color-maroon-500)" }} />
                  <span className="text-[24px] font-extrabold" style={{ color: "#0d2a1a" }}>{value}</span>
                  <span className="text-[12px] text-neutral-500">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[14px] font-bold no-underline transition-all duration-300 hover:brightness-110 active:scale-95"
                style={{ background: "var(--color-maroon-500)", color: "white" }}
              >
                Hubungi Kami
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 border-2"
                style={{ borderColor: "#0d2a1a", color: "#0d2a1a" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "#0d2a1a"; el.style.color = "white"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#0d2a1a"; }}
              >
                Kenali UKM SR
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
