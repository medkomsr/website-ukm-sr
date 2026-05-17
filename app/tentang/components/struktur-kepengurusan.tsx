"use client";

import { wivTentang } from "@/lib/utils";
import { motion } from "framer-motion";
import type { SanityDepartemenCard } from "@/sanity/types";
import Image from "next/image";
import Link from "next/link";

function DeptCard({
  heading,
  abbr,
  imageUrl,
  overlay,
  featured = false,
  slug,
}: {
  heading: string;
  abbr: string;
  imageUrl: string;
  overlay: string;
  featured?: boolean;
  slug: string;
}) {
  return (
    <div>
      <div className="group relative rounded-3xl overflow-hidden" style={{ height: featured ? "380px" : "300px", cursor: "pointer" }}>
        <Image src={imageUrl} alt={abbr} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: overlay }} />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-7 px-4 text-center">
          {/* Small italic label */}
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: featured ? 17 : 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.70)",
              marginBottom: 2,
              letterSpacing: "0.06em",
            }}
          >
            {heading}
          </p>
          {/* Large script abbr */}
          <p
            style={{
              fontFamily: "var(--font-script)",
              fontSize: featured ? 82 : 64,
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#F59E0B",
              textShadow: "0 2px 18px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.30)",
              letterSpacing: "0.01em",
            }}
          >
            {abbr}
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Link
          href={`/tentang/${slug}`}
          className="px-7 py-2.5 rounded-full text-[13px] font-semibold border-2 no-underline transition-all duration-300 inline-block"
          style={{ borderColor: "#0d2a1a", color: "#0d2a1a", background: "transparent" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#0d2a1a";
            el.style.color = "white";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "#0d2a1a";
          }}
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}

export default function StrukturKepengurusanSection({ departments }: { departments: SanityDepartemenCard[] }) {
  return (
    <section className="py-16 md:py-24" style={{ background: "linear-gradient(135deg, #f9f9f3 0%, #f3f0e6 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <motion.span
            {...wivTentang(0)}
            className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--color-maroon-500)" }}
          >
            Organisasi
          </motion.span>
          <motion.h2
            {...wivTentang(0.05)}
            className="text-[26px] md:text-[34px] text-(--color-neutral-1000)"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Struktur Kepengurusan 2024/2025
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {departments.map((dept, i) => (
            <motion.div key={dept._id} {...wivTentang(i * 0.08)} className={i === 0 ? "sm:col-span-2" : ""}>
              <DeptCard {...dept} featured={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
