"use client";

import { BidangDetail, BidangGalleryItem } from "@/lib/bidang-data";
import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

function GalleryCard({ item, delay }: { item: BidangGalleryItem; delay: number }) {
  return (
    <motion.div
      {...wivTentangDept(delay)}
      className="group relative overflow-hidden rounded-2xl"
      style={{ aspectRatio: "4/3" }}
    >
      {/* Photo — scales on group hover */}
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      />

      {/* Always-on dark gradient for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.12) 48%, transparent 100%)",
        }}
      />

      {/* Shimmer overlay — fades in on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)",
        }}
      />

      {/* Caption — slides up on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-4 pointer-events-none translate-y-1 group-hover:translate-y-0 transition-transform duration-500"
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 14,
            fontWeight: 600,
            color: "white",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            lineHeight: 1.4,
          }}
        >
          {item.caption}
        </p>
      </div>
    </motion.div>
  );
}

export default function GaleriSection({ data }: { data: BidangDetail }) {
  return (
    <section
      className="py-14 md:py-20"
      style={{ background: "linear-gradient(135deg, #f9f9f3 0%, #f3f0e6 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div {...wivTentangDept(0)} className="mb-10 text-center">
          <span
            className="text-[12px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "var(--color-maroon-500)" }}
          >
            Dokumentasi
          </span>
          <h2
            className="text-[24px] md:text-[32px] mt-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Galeri Kegiatan
          </h2>
          <p className="text-[14px] text-neutral-500 mt-2">
            Dokumentasi kegiatan dan karya Bidang {data.fullName}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {data.gallery.map((item, i) => (
            <GalleryCard key={i} item={item} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
