"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAktivitas } from "@/hooks/useAktivitas";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function NewsSection() {
  const { data: aktivitas } = useAktivitas();
  const news = (aktivitas ?? []).filter((a) => a.type === "article").slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              {...fadeUp(0)}
              className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold"
              style={{ color: "var(--color-maroon-500)" }}
            >
              Berita
            </motion.span>
            <motion.h2
              {...fadeUp(0.1)}
              className="text-[30px] md:text-[42px] text-(--color-neutral-1000) leading-tight"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              Berita <span style={{ color: "var(--color-maroon-500)" }}>Terkini</span>
            </motion.h2>
          </div>
          <motion.div {...fadeUp(0.15)}>
            <Link
              href="/aktivitas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold no-underline transition-all duration-300 group"
              style={{ border: "1px solid #fbcbcb", color: "var(--color-maroon-500)" }}
            >
              Semua Berita
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <Link
              key={item._id}
              href={`/aktivitas/${item.slug}`}
              className={`no-underline flex flex-col h-full ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <motion.div {...fadeUp(i * 0.1)} className="h-full group cursor-pointer">
                <Card className="h-full rounded-3xl border-neutral-100 hover:border-[color-mix(in_srgb,var(--color-maroon-500)_30%,transparent)] shadow-sm hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 gap-0 py-0">

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden rounded-t-3xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                    {/* Badges — top left */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge
                        className="text-[11px] backdrop-blur-sm rounded-lg px-2.5 py-1 h-auto font-semibold"
                        style={{ background: "rgba(255,255,255,0.9)", color: "#262626", border: "none" }}
                      >
                        Artikel
                      </Badge>
                    </div>

                    {/* Category — top right */}
                    <Badge
                      className="absolute top-3 right-3 text-[11px] backdrop-blur-sm rounded-lg px-2.5 py-1 h-auto font-medium"
                      style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.9)", border: "none" }}
                    >
                      {item.category}
                    </Badge>
                  </div>

                  {/* Main content */}
                  <CardContent className="px-5 pt-4 pb-0 flex flex-col flex-1">
                    {/* Date / read time meta */}
                    <div className="flex items-center gap-3 text-[12px] text-neutral-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                      {item.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {item.readTime}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-(--color-neutral-1000) mb-2 leading-snug group-hover:text-(--color-maroon-500) transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] text-neutral-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </CardContent>

                  {/* Footer CTA */}
                  <CardFooter className="px-5 pt-3 pb-5 border-t border-neutral-100 group-hover:border-[color-mix(in_srgb,var(--color-maroon-500)_20%,transparent)] transition-colors">
                    <span
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-300"
                      style={{ color: "var(--color-maroon-500)" }}
                    >
                      Baca Selengkapnya
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
                    </span>
                  </CardFooter>

                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
