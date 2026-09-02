"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { statusStyles } from "@/lib/types/data";
import type { SanityActivity } from "@/sanity/types";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateRangeId } from "@/lib/content-date";

export default function ActivityCard({ item, delay }: { item: SanityActivity; delay: number }) {
  const isEvent = item.type === "event";
  const st = item.status ? statusStyles[item.status] : null;
  return (
    <Link href={`/aktivitas/${item.slug}`} className="no-underline flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="h-full"
      >
        <Card className="group h-full rounded-2xl border-neutral-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[color-mix(in_srgb,var(--color-maroon-500)_30%,transparent)] cursor-pointer gap-0 py-0">
          {/* Image */}
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

            {/* Type + status badges — top left */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Badge
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold h-auto backdrop-blur-sm"
                style={{
                  background: isEvent ? "rgba(153,27,27,0.9)" : "rgba(255,255,255,0.9)",
                  color: isEvent ? "white" : "#262626",
                  border: isEvent ? "1px solid rgba(153,27,27,0.5)" : "1px solid rgba(255,255,255,0.5)",
                }}
              >
                {isEvent ? "Kegiatan" : "Artikel"}
              </Badge>
              {isEvent && st && (
                <Badge
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold h-auto"
                  style={{ background: st.bg, color: st.text, border: "none" }}
                >
                  {st.label}
                </Badge>
              )}
            </div>

            {/* Category — top right */}
            <Badge
              className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-medium h-auto backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.9)", border: "none" }}
            >
              {item.category}
            </Badge>
          </div>

          {/* Content */}
          <CardContent className="px-5 pt-4 pb-0 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-[12px] text-neutral-400 mb-2.5">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDateRangeId(item.date, isEvent ? item.endDate : undefined)}
              </span>
              {isEvent && item.time && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.time}
                </span>
              )}
              {!isEvent && item.readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.readTime}
                </span>
              )}
            </div>
            <h3 className="text-[15px] font-bold text-(--color-neutral-1000) mb-2 leading-snug group-hover:text-(--color-maroon-500) transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-[13px] text-neutral-500 leading-relaxed flex-1 line-clamp-3 mb-4">{item.description}</p>
            {isEvent && item.location && (
              <div className="flex items-center gap-1.5 text-[12px] text-neutral-400 mb-3">
                <MapPin size={12} />
                {item.location}
              </div>
            )}
          </CardContent>

          {/* Footer CTA */}
          <CardFooter className="px-5 pt-3 pb-5 border-t border-neutral-100 group-hover:border-[color-mix(in_srgb,var(--color-maroon-500)_20%,transparent)] transition-colors">
            <span
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-300"
              style={{ color: "var(--color-maroon-500)" }}
            >
              {isEvent ? "Lihat Detail" : "Baca Selengkapnya"}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}
