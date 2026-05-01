"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { Activity, statusConfig } from "@/lib/data";

export default function HeroSection({ item, isEvent }: { item: Activity; isEvent: boolean }) {
  const st = item.status ? statusConfig[item.status] : null;

  const overlayGradient = isEvent
    ? "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.88) 100%)"
    : "linear-gradient(to bottom, rgba(66,10,10,0.10) 0%, rgba(66,10,10,0.85) 100%)";

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
      <Image src={item.image} alt={item.title} fill className="object-cover" priority />
      <div className="absolute inset-0" style={{ background: overlayGradient }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16 flex flex-col h-full" style={{ minHeight: 480 }}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-[12px] text-white/60 mb-auto"
        >
          <Link href="/" className="text-white/60 hover:text-white no-underline transition-colors">
            Beranda
          </Link>
          <ChevronRight size={12} />
          <Link href="/aktivitas" className="text-white/60 hover:text-white no-underline transition-colors">
            Kegiatan &amp; Aktivitas
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/90 line-clamp-1 max-w-[200px]">{item.title}</span>
        </motion.div>

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 mb-4 mt-8"
        >
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm"
            style={{
              background: isEvent ? "rgba(153,27,27,0.85)" : "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {isEvent ? "Kegiatan" : "Artikel"}
          </span>
          <span
            className="px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            {item.category}
          </span>
          {isEvent && st && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: st.bg, color: st.text }}>
              {st.label}
            </span>
          )}
          {!isEvent && item.readTime && (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1"
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <BookOpen size={10} /> {item.readTime} baca
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-[32px] md:text-[48px] leading-tight text-white"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, maxWidth: 760, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
        >
          {item.title}
        </motion.h1>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-wrap items-center gap-4 mt-4 text-[13px] text-white/75"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {item.date}
          </span>
          {isEvent && item.time && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {item.time}
            </span>
          )}
          {!isEvent && item.author && (
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {item.author.name}
            </span>
          )}
          {isEvent && item.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {item.location}
            </span>
          )}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full" style={{ height: 56, display: "block" }}>
          <path d="M0,28 C360,56 720,0 1080,36 C1260,50 1350,42 1440,32 L1440,56 L0,56 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
