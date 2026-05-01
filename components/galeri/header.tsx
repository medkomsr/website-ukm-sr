"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeaderSection() {
  return (
    <section
      className="pt-12 pb-14 border-b border-neutral-200 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fcfbe6 0%, #f6f1c8 50%, #f0eaa8 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-6">
          <Link href="/" className="text-neutral-400 hover:text-(--color-maroon-500) no-underline transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-neutral-600">Galeri</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-[32px] md:text-[42px] text-(--color-neutral-1000) mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Galeri Dokumentasi
          </h1>
          <p className="text-[16px] text-neutral-500 max-w-xl leading-relaxed">
            Dokumentasi kegiatan dan karya terbaik dari anggota UKM Seni Religi.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
