"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useBidangBySlug } from "@/hooks/useBidang";
import { getOverlayGradient } from "@/lib/overlay-theme";
import { notFound } from "next/navigation";

export default function HeroSection({ slug }: { slug: string }) {
  const { data, isLoading } = useBidangBySlug(slug);

  if (isLoading) {
    return <section className="relative overflow-hidden bg-neutral-900 animate-pulse" style={{ minHeight: 420 }} />;
  }

  if (!data) return notFound();

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
      <Image src={data.imageUrl} alt={data.abbr} fill className="object-cover" priority />
      <div className="absolute inset-0" style={{ background: getOverlayGradient(data.overlayTheme) }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-[12px] text-white/60 mb-8 flex-wrap"
        >
          <Link href="/" className="text-white/60 hover:text-white no-underline transition-colors">
            Beranda
          </Link>
          <ChevronRight size={12} />
          <Link href="/tentang" className="text-white/60 hover:text-white no-underline transition-colors">
            Tentang
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/60">Bidang Seni</span>
          <ChevronRight size={12} />
          <span className="text-white/90">{data.abbr}</span>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase mb-4"
          style={{ color: "#F59E0B" }}
        >
          {data.heading} Seni
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-[36px] md:text-[52px] leading-tight text-white"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, maxWidth: 640 }}
        >
          {data.fullName}
        </motion.h1>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0,30 C360,60 720,0 1080,40 C1260,55 1350,45 1440,35 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
