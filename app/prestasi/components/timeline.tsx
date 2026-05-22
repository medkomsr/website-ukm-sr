"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Trophy, Star, Handshake, BookMarked, MapPin, Building2, Medal, Award} from "lucide-react";
import { usePrestasi } from "@/hooks/usePrestasi";
import type { SanityPrestasi } from "@/sanity/types";

type Category = SanityPrestasi["category"];
type Level    = SanityPrestasi["level"];

const CATEGORY_CONFIG: Record<Category, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  Kompetisi:    { label: "Kompetisi",   icon: Trophy,     color: "#991b1b", bg: "#fef2f2" },
  Penghargaan:  { label: "Penghargaan", icon: Star,       color: "#d97706", bg: "#fffbeb" },
  Kolaborasi:   { label: "Kolaborasi",  icon: Handshake,  color: "#0d7a6e", bg: "#f0fdfa" },
  "Rekam Jejak":{ label: "Rekam Jejak", icon: BookMarked, color: "#4d7c0f", bg: "#f7fee7" },
};

const LEVEL_CONFIG: Record<Level, { color: string; bg: string; ring: string }> = {
  Kampus:        { color: "#525252", bg: "#f5f5f5",  ring: "#d4d4d4" },
  Kota:          { color: "#0369a1", bg: "#eff6ff",  ring: "#bfdbfe" },
  Provinsi:      { color: "#059669", bg: "#f0fdf4",  ring: "#bbf7d0" },
  Nasional:      { color: "#b45309", bg: "#fffbeb",  ring: "#fde68a" },
  Internasional: { color: "#991b1b", bg: "#fef2f2",  ring: "#fecaca" },
};

const POSITION_STYLE: Record<string, { bg: string; color: string }> = {
  "Juara 1": { bg: "linear-gradient(135deg,#b45309,#d97706)", color: "white" },
  "Juara 2": { bg: "linear-gradient(135deg,#6b7280,#9ca3af)", color: "white" },
  "Juara 3": { bg: "linear-gradient(135deg,#92400e,#b45309)", color: "white" },
};

const ALL_CATEGORIES: ("all" | Category)[] = ["all", "Kompetisi", "Penghargaan", "Kolaborasi", "Rekam Jejak"];
const ALL_LEVELS: ("all" | Level)[] = ["all", "Nasional", "Provinsi", "Kota", "Kampus"];

function AchievementCard({ item, delay = 0 }: { item: SanityPrestasi; delay?: number }) {
  const cat    = CATEGORY_CONFIG[item.category];
  const lv     = LEVEL_CONFIG[item.level];
  const pos    = item.position ? POSITION_STYLE[item.position] : null;
  const CatIcon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col h-full"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cat.color}99 0%, ${cat.color} 60%, transparent 100%)` }} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Badge row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ background: cat.bg, color: cat.color }}>
            <CatIcon size={11} />
            {cat.label}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border ml-auto"
            style={{ background: lv.bg, color: lv.color, borderColor: lv.ring }}>
            {item.level}
          </span>
        </div>

        {/* Position ribbon */}
        {pos && (
          <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-bold"
            style={{ background: pos.bg, color: pos.color }}>
            <Medal size={12} />
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
        <h3 className="text-[15px] font-bold leading-snug text-(--color-neutral-1000) group-hover:text-(--color-maroon-500) transition-colors"
          style={{ fontFamily: "var(--font-display)" }}>
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-neutral-500 leading-relaxed line-clamp-3 flex-1">
          {item.description}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-100 mt-auto">
          <div className="flex items-start gap-1.5 text-[12px] text-neutral-400">
            <Building2 size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1">{item.organizer}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-neutral-400">
            <MapPin size={12} className="shrink-0" />
            <span>{item.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelineSection() {
  const { data: prestasi, isLoading, error } = usePrestasi();
  const [catFilter, setCatFilter]     = useState<"all" | Category>("all");
  const [levelFilter, setLevelFilter] = useState<"all" | Level>("all");

  const filtered = useMemo(() => {
    let list = prestasi ?? [];
    if (catFilter   !== "all") list = list.filter((a) => a.category === catFilter);
    if (levelFilter !== "all") list = list.filter((a) => a.level    === levelFilter);
    return list;
  }, [catFilter, levelFilter, prestasi]);

  const byYear = useMemo(() => {
    const map = new Map<number, SanityPrestasi[]>();
    for (const a of filtered) {
      if (!map.has(a.year)) map.set(a.year, []);
      map.get(a.year)!.push(a);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const hasFilter = catFilter !== "all" || levelFilter !== "all";

  if (isLoading) return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 text-center py-20">
        <p className="text-neutral-400">Memuat prestasi...</p>
      </div>
    </section>
  );

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
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
            <div className="flex flex-wrap items-center gap-1.5">
              {ALL_CATEGORIES.map((c) => {
                const active = catFilter === c;
                const cfg = c !== "all" ? CATEGORY_CONFIG[c as Category] : null;
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

            <div className="flex flex-wrap items-center gap-1.5">
              {ALL_LEVELS.map((l) => {
                const active = levelFilter === l;
                const lvcfg = l !== "all" ? LEVEL_CONFIG[l as Level] : null;
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

          <p className="text-[13px] text-neutral-400 mt-3">
            Menampilkan{" "}
            <span className="text-neutral-700 font-semibold">{filtered.length}</span> prestasi
            {hasFilter && (
              <button
                onClick={() => { setCatFilter("all"); setLevelFilter("all"); }}
                className="ml-3 text-(--color-maroon-500) font-semibold cursor-pointer border-none bg-transparent text-[13px]"
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
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-[15px]"
                      style={{ background: "linear-gradient(135deg,#0d2a1a,#1a4a2e)", color: "#F59E0B" }}>
                      {String(year).slice(2)}
                    </div>
                    <div>
                      <p className="text-[22px] font-extrabold text-(--color-neutral-1000)">{year}</p>
                      <p className="text-[12px] text-neutral-400">{items.length} prestasi</p>
                    </div>
                    <div className="flex-1 h-px bg-neutral-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item, i) => (
                      <AchievementCard key={item._id} item={item} delay={i * 0.06} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
