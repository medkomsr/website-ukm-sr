"use client";

import { wivTentang } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { IMAGES } from "@/lib/data";
import { Users, Award, CalendarDays, Star } from "lucide-react";

const stats = [
  { icon: Users, num: "150+", label: "Anggota Aktif", gradient: "from-green-500 to-green-700" },
  { icon: Award, num: "25+", label: "Penghargaan", gradient: "from-teal-500 to-teal-700" },
  { icon: CalendarDays, num: "50+", label: "Kegiatan/Tahun", gradient: "from-lime-500 to-lime-700" },
  { icon: Star, num: "11", label: "Tahun Berdiri", gradient: "from-emerald-400 to-emerald-600" },
];

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div {...wivTentang(0)} className="relative">
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
              <Image src={IMAGES.community} alt="Komunitas" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div
              className="absolute -bottom-4 -right-4 px-5 py-3 rounded-2xl shadow-lg"
              style={{ background: "var(--color-maroon-500)", color: "white" }}
            >
              <div className="text-[22px] font-extrabold">2015</div>
              <div className="text-[11px] text-white/70">Tahun Berdiri</div>
            </div>
          </motion.div>
          <div>
            <motion.span
              {...wivTentang(0.05)}
              className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold"
              style={{ color: "var(--color-maroon-500)" }}
            >
              Tentang
            </motion.span>
            <motion.h2
              {...wivTentang(0.1)}
              className="text-[26px] md:text-[34px] text-(--color-neutral-1000) mb-5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              Kenali Kami Lebih Dekat
            </motion.h2>
            <motion.p {...wivTentang(0.15)} className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              UKM Seni Religi merupakan Unit Kegiatan Mahasiswa yang berdiri sejak tahun 2015 di bawah naungan Universitas Brawijaya. Organisasi ini
              berfokus pada pengembangan seni yang bernuansa keagamaan, menjadi wadah bagi mahasiswa untuk mengekspresikan kreativitas dalam bingkai
              spiritualitas.
            </motion.p>
            <motion.p {...wivTentang(0.2)} className="text-[15px] text-neutral-600 leading-relaxed mb-8">
              Kegiatan utama meliputi kaligrafi, nasyid, tilawah Al-Quran, puisi religi, dan seni pertunjukan islami. UKM ini terbuka untuk seluruh
              mahasiswa aktif Universitas Brawijaya yang memiliki minat dalam seni keagamaan.
            </motion.p>
            <motion.div {...wivTentang(0.25)} className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, num, label, gradient }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[20px] font-extrabold text-(--color-neutral-1000)">{num}</div>
                    <div className="text-[11px] text-neutral-500">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
