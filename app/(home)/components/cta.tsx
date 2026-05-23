"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { IMAGES } from "@/lib/types/data";

export default function CtaSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={IMAGES.mosque} alt="" fill className="object-cover opacity-20" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, var(--color-maroon-900) 0%, #1c1917 50%, #052e16 100%)" }}
        />
      </div>

      {/* Decorative sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "15%", left: "8%", size: 6 },
          { top: "70%", right: "12%", size: 4 },
          { top: "40%", left: "75%", size: 5 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-lime-400/20 animate-pulse"
            style={{ top: s.top, left: (s as any).left, right: (s as any).right, width: s.size * 4, height: s.size * 4 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block text-[13px] tracking-[0.2em] uppercase mb-5 font-bold text-lime-400"
        >
          Bergabung Bersama Kami
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[32px] md:text-[48px] text-white mb-5 leading-tight"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Jadilah Bagian dari{" "}
          <span className="text-lime-400">Keluarga</span>{" "}
          Seni Religi
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[16px] text-white/60 mb-10 max-w-lg mx-auto"
        >
          Daftarkan diri Anda sekarang dan jadilah bagian dari keluarga besar UKM Seni Religi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/tentang"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-bold no-underline transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5"
            style={{ background: "#84cc16", color: "var(--color-maroon-900)" }}
          >
            Daftar Sekarang
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold no-underline transition-all duration-300 hover:bg-white/15"
            style={{ border: "1px solid rgba(255,255,255,0.25)", color: "white" }}
          >
            Hubungi Kami
          </Link>
        </motion.div>

        {/* Benefits row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap gap-6 justify-center"
        >
          {[
            "Asah kemampuan kaligrafi, nasyid, tilawah, dan seni religi lainnya",
            "Bertemu dengan mahasiswa yang memiliki visi yang sama",
            "Ikuti kompetisi dan tampil di berbagai acara kampus",
          ].map((b) => (
            <div key={b} className="flex items-center gap-2 text-[14px] text-white/60">
              <Star size={12} className="text-lime-400 shrink-0" />
              {b}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
