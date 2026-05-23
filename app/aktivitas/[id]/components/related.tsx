"use client";

import Image from "next/image";
import { statusConfig } from "@/lib/types/data";
import { motion } from "framer-motion";
import { wivGeneral } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar } from "lucide-react";
import type { SanityActivity } from "@/sanity/types";
import { useAktivitasBySlug, useRelatedAktivitas } from "@/hooks/useAktivitas";

function RelatedCard({ item }: { item: SanityActivity }) {
  const isEvent = item.type === "event";
  const st = item.status ? statusConfig[item.status] : null;
  return (
    <Link href={`/aktivitas/${item.slug}`} className="no-underline block">
      <Card className="group rounded-2xl border-neutral-100 overflow-hidden hover:border-[color-mix(in_srgb,var(--color-maroon-500)_30%,transparent)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer gap-0 py-0">
        {/* Image */}
        <div className="relative h-40 overflow-hidden rounded-t-2xl">
          <Image src={item.imageUrl || ''} alt={item.title || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

          {/* Type + status badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <Badge
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold h-auto backdrop-blur-sm"
              style={{
                background: isEvent ? "rgba(153,27,27,0.9)" : "rgba(255,255,255,0.9)",
                color: isEvent ? "white" : "#262626",
                border: "none",
              }}
            >
              {isEvent ? "Kegiatan" : "Artikel"}
            </Badge>
            {isEvent && st && (
              <Badge
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold h-auto"
                style={{ background: st.bg, color: st.text, border: "none" }}
              >
                {st.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Text content */}
        <CardContent className="p-4">
          <p className="text-[11px] text-neutral-400 mb-1.5 flex items-center gap-1">
            <Calendar size={10} />
            {item.date}
          </p>
          <h4 className="text-[13px] font-bold text-(--color-neutral-1000) leading-snug group-hover:text-(--color-maroon-500) transition-colors line-clamp-2">
            {item.title}
          </h4>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function RelatedSection({ slug }: { slug: string }) {
  const { data: activity } = useAktivitasBySlug(slug);
  const { data: related, isLoading } = useRelatedAktivitas(slug, activity?.category || '');

  if (!isLoading && (!related || related.length === 0)) return null;

  return (
    <section className="py-12 md:py-16 border-t border-neutral-100" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div {...wivGeneral(0)} className="mb-8">
          <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
            Lainnya
          </span>
          <h2 className="text-[22px] md:text-[28px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Kegiatan &amp; Artikel Terkait
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {related?.map((a, i) => (
            <motion.div key={a._id} {...wivGeneral(i * 0.08)}>
              <RelatedCard item={a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
