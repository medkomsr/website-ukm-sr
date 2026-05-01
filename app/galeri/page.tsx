"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import SiteLayout from "@/components/site-layout";
import { galleryImages, IMAGES } from "@/lib/data";

const allGallery = [
  ...galleryImages,
  { src: IMAGES.festival, alt: "Festival 2026", caption: "Festival Seni Religi 2026" },
  { src: IMAGES.mosque, alt: "Latihan Tilawah", caption: "Latihan Tilawah" },
  { src: IMAGES.writing, alt: "Workshop Puisi", caption: "Workshop Puisi" },
  { src: IMAGES.geometric, alt: "Motif Islami", caption: "Motif Islami" },
];

export default function GaleriPage() {
  const [lightbox, setLightbox] = useState<typeof allGallery[0] | null>(null);

  return (
    <SiteLayout>
      {/* Header */}
      <section
        className="pt-12 pb-14 border-b border-neutral-200 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fcfbe6 0%, #f6f1c8 50%, #f0eaa8 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-6">
            <Link href="/" className="text-neutral-400 hover:text-[var(--color-maroon-500)] no-underline transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-neutral-600">Galeri</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-[32px] md:text-[42px] text-[var(--color-neutral-1000)] mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Galeri Dokumentasi
            </h1>
            <p className="text-[16px] text-neutral-500 max-w-xl leading-relaxed">
              Dokumentasi kegiatan dan karya terbaik dari anggota UKM Seni Religi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {allGallery.map((img, i) => (
              <motion.div
                key={`${img.src}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-4"
                onClick={() => setLightbox(img)}
              >
                <div className="relative" style={{ aspectRatio: i % 5 === 0 ? "3/4" : "4/3" }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                      <ZoomIn size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-[13px] font-semibold">{img.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                <X size={18} />
              </button>
              <div className="relative w-full max-h-[75vh]" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <p className="text-center text-white/70 text-[14px] mt-4">{lightbox.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteLayout>
  );
}
