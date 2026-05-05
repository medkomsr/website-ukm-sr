"use client";

import { wivTentang } from "@/lib/utils";
import { motion } from "framer-motion";
import { BIDANG_DATA } from "@/lib/bidang-data";
import Image from "next/image";
import Link from "next/link";

function BidangCard({
  heading,
  abbr,
  img,
  overlay,
  slug,
}: {
  heading: string;
  abbr: string;
  img: string;
  overlay: string;
  slug: string;
}) {
  return (
    <div>
      <div
        className="group relative rounded-3xl overflow-hidden"
        style={{ height: "300px" }}
      >
        <Image
          src={img}
          alt={abbr}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: overlay }} />

        {/* Shimmer sweep on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 50%, transparent 80%)",
            transition: "opacity 0.6s ease",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-7 px-4 text-center">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.70)",
              marginBottom: 2,
              letterSpacing: "0.06em",
            }}
          >
            {heading}
          </p>
          <p
            style={{
              fontFamily: "var(--font-script)",
              fontSize: 64,
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
          href={`/tentang/bidang/${slug}`}
          className="px-7 py-2.5 rounded-full text-[13px] font-semibold border-2 no-underline transition-all duration-300 inline-block"
          style={{ borderColor: "#7f1d1d", color: "#7f1d1d", background: "transparent" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#7f1d1d";
            el.style.color = "white";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "#7f1d1d";
          }}
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}

const bidangList = Object.values(BIDANG_DATA);

export default function BidangSeniSection() {
  return (
    <section
      id="bidang-seni"
      className="py-16 md:py-24"
      style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fde8d8 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <motion.h2
            {...wivTentang(0)}
            className="text-[26px] md:text-[34px] text-(--color-neutral-1000)"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Bidang Seni UKM SR
          </motion.h2>
          <motion.p
            {...wivTentang(0.1)}
            className="text-[15px] text-neutral-500 mt-3 max-w-xl mx-auto leading-relaxed"
          >
            Delapan bidang seni & ilmu Al-Qur'an yang menjadi pilar pengembangan kreativitas dan spiritualitas anggota UKM Seni Religi.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {bidangList.map((bidang, i) => (
            <motion.div key={bidang.slug} {...wivTentang(i * 0.08)}>
              <BidangCard
                heading={bidang.heading}
                abbr={bidang.abbr}
                img={bidang.img}
                overlay={bidang.overlay}
                slug={bidang.slug}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
