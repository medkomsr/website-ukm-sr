"use client";

import { motion } from "framer-motion";
import {Trophy, Star, Handshake, BookMarked, MapPin, Building2, Medal} from "lucide-react";
import { useFeaturedPrestasi } from "@/hooks/usePrestasi";
import type { SanityPrestasi } from "@/sanity/types";

const CATEGORY_CONFIG = {
  Kompetisi:    { label: "Kompetisi",   icon: Trophy,     color: "#991b1b", bg: "#fef2f2" },
  Penghargaan:  { label: "Penghargaan", icon: Star,       color: "#d97706", bg: "#fffbeb" },
  Kolaborasi:   { label: "Kolaborasi",  icon: Handshake,  color: "#0d7a6e", bg: "#f0fdfa" },
  "Rekam Jejak":{ label: "Rekam Jejak", icon: BookMarked, color: "#4d7c0f", bg: "#f7fee7" },
};

const LEVEL_CONFIG = {
  Kampus:        { color: "#525252", bg: "#f5f5f5",  ring: "#d4d4d4" },
  Kota:          { color: "#0369a1", bg: "#eff6ff",  ring: "#bfdbfe" },
  Provinsi:      { color: "#059669", bg: "#f0fdf4",  ring: "#bbf7d0" },
  Nasional:      { color: "#b45309", bg: "#fffbeb",  ring: "#fde68a" },
  Internasional: { color: "#991b1b", bg: "#fef2f2",  ring: "#fecaca" },
};

function FeaturedCard({ item, delay = 0 }: { item: SanityPrestasi; delay?: number }) {
  const cat = CATEGORY_CONFIG[item.category];
  const lv  = LEVEL_CONFIG[item.level];
  const CatIcon = cat.icon;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden group h-full"
      style={{
        background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 60%, #0d2a1a 100%)",
        boxShadow: "0 8px 40px rgba(13,42,26,0.25)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url("/element-islamic.png")`, backgroundSize: "cover" }} />
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #F59E0B, transparent)" }} />

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

        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            <Building2 size={12} />{item.organizer}
          </span>
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            <MapPin size={12} />{item.location}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return inner;
}

export default function FeaturedSection() {
  const { data: featured, isLoading, error } = useFeaturedPrestasi();

  if (isLoading || !featured?.length) return null;

  return (
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
            <FeaturedCard key={item._id} item={item} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
