"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { SanityGalleryItem } from "@/sanity/types";

export default function GalleryGridSection({ items, setLightbox }: { items: SanityGalleryItem[]; setLightbox: (img: SanityGalleryItem) => void }) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {items.map((img, i) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-4"
              onClick={() => setLightbox(img)}
            >
              <div className="relative" style={{ aspectRatio: i % 5 === 0 ? "3/4" : "4/3" }}>
                <Image
                  src={img.imageUrl}
                  alt={img.alt}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
                  >
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
  );
}
