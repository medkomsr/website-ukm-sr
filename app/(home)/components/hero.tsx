"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";
import { IMAGES } from "@/lib/data";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#0d2a1a" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src={IMAGES.golden} alt="" fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(13,42,26,0.65) 0%, rgba(13,42,26,0.42) 50%, rgba(13,42,26,0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(13,42,26,0.62) 40%, rgba(13,42,26,0.10) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 w-full py-24 md:py-0">
        <div className="flex flex-col items-center text-center min-h-[80vh] justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-[38px] md:text-[52px] lg:text-[64px] text-white leading-[1.15] mb-6"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Selamat Datang di
            <br />
            <span style={{ color: "#F59E0B" }}>UKM Seni Religi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase font-semibold mb-8"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            Universitas Brawijaya
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="text-[17px] md:text-[20px] leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "rgba(245,158,11,0.85)",
            }}
          >
            "Hidup itu Seni, Seni itu Indah,
            <br />
            Indah itu Baik, Yang Baik Disenangi"
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}>
            <Link
              href="/aktivitas"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[15px] font-semibold no-underline"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                transition: "background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#F59E0B";
                el.style.borderColor = "#F59E0B";
                el.style.color = "#1a1a0a";
                el.style.boxShadow = "0 0 24px rgba(245,158,11,0.55), 0 0 8px rgba(245,158,11,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.12)";
                el.style.borderColor = "rgba(255,255,255,0.2)";
                el.style.color = "white";
                el.style.boxShadow = "none";
              }}
            >
              <Play size={14} fill="currentColor" className="text-amber-400" />
              Lihat Kegiatan
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
      >
        <span
          className="text-[10px] font-semibold tracking-[0.22em] uppercase"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Geser ke bawah
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={22} style={{ color: "rgba(245,158,11,0.65)" }} />
        </motion.div>
      </motion.div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,40 C360,80 720,10 1080,50 C1260,70 1350,60 1440,45 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
