"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="pt-12 pb-16 relative overflow-hidden border-b border-neutral-200"
      style={{ background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 55%, #0d2a1a 100%)" }}
    >
      {/* Islamic watermark */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url("/element-islamic.png")`, backgroundSize: "cover" }} />
      {/* Gold shimmer bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
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
            <span style={{ color: "#F59E0B" }}>Prestasi &amp; Penghargaan</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.60)", maxWidth: 520, lineHeight: 1.75, marginBottom: 32 }}>
            Kumpulan pencapaian UKM Seni Religi Universitas Brawijaya dari 2020 hingga kini — bukti nyata komitmen kami dalam berkarya dan berprestasi di tingkat kampus, regional, hingga nasional.
          </p>

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
  );
}
