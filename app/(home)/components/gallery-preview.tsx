"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Images } from "lucide-react";
import { galleryImages } from "@/lib/data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const preview = galleryImages.slice(0, 6);

export default function GallerySection() {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--color-maroon-900) 0%, var(--color-maroon-950,#2d0505) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span {...fadeUp(0)} className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold text-lime-400">
            Galeri
          </motion.span>
          <motion.h2
            {...fadeUp(0.1)}
            className="text-[30px] md:text-[42px] text-white mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Galeri Dokumentasi
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[16px] text-white/50 max-w-lg mx-auto">
            Dokumentasi kegiatan dan karya terbaik dari anggota UKM Seni Religi.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-10">
          {preview.map((img, i) => (
            <motion.div
              key={img.src}
              {...fadeUp(i * 0.08)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 ? "md:row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "auto" : "4/3", minHeight: i === 0 ? 320 : 160 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-[13px] font-semibold">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)} className="text-center">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 hover:bg-lime-400 hover:text-(--color-maroon-900)"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
          >
            <Images size={16} />
            Lihat Seluruh Galeri
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
