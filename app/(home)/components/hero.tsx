"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { IMAGES } from "@/lib/data";
import type { SanityHomePage, SanitySiteSettings } from "@/sanity/types";

type Props = {
  home: SanityHomePage | null
  settings: SanitySiteSettings | null
}

export default function HeroSection({ home, settings }: Props) {
  const hero = home?.hero
  const judul1 = hero?.judul1 ?? "Seni yang "
  const judulHighlight = hero?.judulHighlight ?? "Menginspirasi"
  const judul2 = hero?.judul2 ?? "Iman yang Menguatkan"
  const deskripsi = hero?.deskripsi ?? "UKM Seni Religi adalah wadah bagi mahasiswa yang ingin mengembangkan bakat seni bernuansa keagamaan."
  const ctaText = hero?.ctaText ?? "Lihat Kegiatan"

  const anggota = settings?.jumlahAnggota ?? "150+"
  const penghargaan = settings?.jumlahPenghargaan ?? "25+"
  const tahun = settings?.tahunBerdiri
    ? `${new Date().getFullYear() - settings.tahunBerdiri}+`
    : "10+"

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#0d2a1a" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src={IMAGES.golden} alt="" fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(13,42,26,0.90) 0%, rgba(13,42,26,0.70) 50%, rgba(13,42,26,0.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(13,42,26,0.88) 40%, rgba(13,42,26,0.25) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-24 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              className="text-[40px] md:text-[56px] lg:text-[64px] text-white leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              {judul1}<span style={{ color: "#F59E0B" }}>{judulHighlight}</span>
              <br />
              {judul2}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-[17px] md:text-[19px] text-white/70 leading-relaxed mb-10 max-w-md"
            >
              {deskripsi}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
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
                {ctaText}
              </Link>
            </motion.div>
          </div>

          {/* Right – stat badges */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="hidden lg:block relative"
            style={{ height: "460px" }}
          >
            <div className="absolute left-12 top-10 right-0 bottom-8 rounded-3xl overflow-hidden shadow-2xl">
              <Image src={IMAGES.geometric} alt="Islamic geometric pattern" fill className="object-cover" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute top-0 left-0 bg-white rounded-2xl shadow-xl z-10"
              style={{ padding: "14px 20px" }}
            >
              <div className="text-[30px] font-extrabold text-gray-900 leading-none">{anggota}</div>
              <div className="text-[13px] text-gray-400 mt-1">Anggota Aktif</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="absolute top-6 right-4 z-10 rounded-full px-4 py-2 text-[13px] font-semibold shadow-lg"
              style={{ background: "#F59E0B", color: "#1a1a1a" }}
            >
              {tahun} Tahun Berdiri
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute bottom-0 right-4 bg-white rounded-2xl shadow-xl z-10"
              style={{ padding: "14px 20px" }}
            >
              <div className="text-[30px] font-extrabold text-gray-900 leading-none">{penghargaan}</div>
              <div className="text-[13px] text-gray-400 mt-1">Penghargaan</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,40 C360,80 720,10 1080,50 C1260,70 1350,60 1440,45 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
