"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Award, CalendarDays, ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/data";
import type { SanityHomePage, SanitySiteSettings } from "@/sanity/types";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const DEFAULT_HIGHLIGHTS = [
  "150+ Anggota dari Seluruh Fakultas",
  "25+ Penghargaan Tingkat Nasional",
  "50+ Kegiatan Setiap Tahun",
];

const ICON_MAP = [Users, Award, CalendarDays];

type Props = {
  home: SanityHomePage | null
  settings: SanitySiteSettings | null
}

export default function AboutSection({ home, settings }: Props) {
  const about = home?.about
  const judul1 = about?.judul1 ?? "Berkarya dengan tulus, "
  const judulHighlight = about?.judulHighlight ?? "Inovasi tanpa batas"
  const deskripsi1 = about?.deskripsi1 ?? "UKM Seni Religi adalah Unit Kegiatan Mahasiswa yang berdiri sejak tahun 2015, berfokus pada pengembangan seni bernuansa keagamaan. Kami mewadahi minat dan bakat mahasiswa dalam kaligrafi, nasyid, tilawah, puisi religi, dan seni pertunjukan islami."
  const deskripsi2 = about?.deskripsi2 ?? "Dengan lebih dari 150 anggota aktif dan puluhan kegiatan setiap tahunnya, kami berkomitmen menjadi wadah kreativitas yang berlandaskan nilai-nilai islami."
  const highlights = about?.highlights?.length ? about.highlights : DEFAULT_HIGHLIGHTS
  const tahunBerdiri = settings?.tahunBerdiri ?? 2015

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <motion.div {...fadeUp} className="relative">
            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src={IMAGES.community} alt="Komunitas UKM" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div
              className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl shadow-xl"
              style={{ background: "var(--color-maroon-500)", color: "white" }}
            >
              <div className="text-[28px] font-extrabold text-white">{tahunBerdiri}</div>
              <div className="text-[12px] text-white/70">Tahun Berdiri</div>
            </div>
          </motion.div>

          {/* Text */}
          <div>
            <motion.span
              {...fadeUp}
              className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold"
              style={{ color: "var(--color-maroon-500)" }}
            >
              Tentang Kami
            </motion.span>
            <motion.h2
              {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.1 } }}
              className="text-[30px] md:text-[42px] text-(--color-neutral-1000) mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              {judul1}<span style={{ color: "var(--color-maroon-500)" }}>{judulHighlight}</span>
            </motion.h2>
            <motion.p
              {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.15 } }}
              className="text-[15px] text-neutral-600 leading-relaxed mb-4"
            >
              {deskripsi1}
            </motion.p>
            <motion.p
              {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.2 } }}
              className="text-[15px] text-neutral-600 leading-relaxed mb-8"
            >
              {deskripsi2}
            </motion.p>

            <motion.div {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.25 } }} className="space-y-3 mb-8">
              {highlights.map((text, i) => {
                const Icon = ICON_MAP[i % ICON_MAP.length];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "color-mix(in srgb, var(--color-maroon-500) 10%, transparent)" }}
                    >
                      <Icon size={15} style={{ color: "var(--color-maroon-500)" }} />
                    </div>
                    <span className="text-[14px] text-neutral-700">{text}</span>
                  </div>
                );
              })}
            </motion.div>

            <motion.div {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.3 } }}>
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 hover:opacity-90"
                style={{ background: "var(--color-maroon-500)", color: "white" }}
              >
                Selengkapnya Tentang Kami
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
