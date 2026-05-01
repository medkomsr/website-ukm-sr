"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Award, CalendarDays, Star } from "lucide-react";
import SiteLayout from "@/components/site-layout";
import { IMAGES } from "@/lib/data";

function FlipCard({
  frontBg,
  icon,
  title,
  back,
  direction,
}: {
  frontBg: string;
  icon: React.ReactNode;
  title: string;
  back: React.ReactNode;
  direction: "left" | "right";
}) {
  const [flipped, setFlipped] = useState(false);
  const flipDeg = direction === "left" ? -180 : 180;
  const backInitial = direction === "left" ? 180 : -180;

  return (
    <div
      style={{ perspective: "1400px", height: "320px", cursor: "pointer" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? `rotateY(${flipDeg}deg)` : "rotateY(0deg)",
        }}
      >
        {/* FRONT – dark gradient, centered icon + title */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: frontBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
          <p
            style={{
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </p>
        </div>

        {/* BACK – light cream, Islamic geometric watermark + content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: `rotateY(${backInitial}deg)`,
            overflow: "hidden",
            background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
            userSelect: "none",
          }}
        >
          {/* Watermark */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${"/element-islamic.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.06,
            }}
          />
          {/* Content */}
          <div style={{ position: "relative", padding: "32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeptCard({
  heading,
  abbr,
  img,
  overlay,
  featured = false,
  slug,
}: {
  heading: string;
  abbr: string;
  img: string;
  overlay: string;
  featured?: boolean;
  slug: string;
}) {
  return (
    <div>
      <div
        className="group relative rounded-3xl overflow-hidden"
        style={{ height: featured ? "380px" : "300px", cursor: "pointer" }}
      >
        <Image
          src={img}
          alt={abbr}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const wiv = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const stats = [
  { icon: Users, num: "150+", label: "Anggota Aktif", gradient: "from-green-500 to-green-700" },
  { icon: Award, num: "25+", label: "Penghargaan", gradient: "from-teal-500 to-teal-700" },
  { icon: CalendarDays, num: "50+", label: "Kegiatan/Tahun", gradient: "from-lime-500 to-lime-700" },
  { icon: Star, num: "11", label: "Tahun Berdiri", gradient: "from-emerald-400 to-emerald-600" },
];

const departments = [
  { slug: "bkrt", heading: "Badan", abbr: "BKRT", img: IMAGES.community, overlay: "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.90) 100%)", featured: true },
  { slug: "psdm", heading: "Departemen", abbr: "PSDM", img: IMAGES.stage, overlay: "linear-gradient(to bottom, rgba(66,10,10,0.15) 0%, rgba(66,10,10,0.90) 100%)" },
  { slug: "minba", heading: "Departemen", abbr: "Minba", img: IMAGES.calligraphy, overlay: "linear-gradient(to bottom, rgba(66,10,10,0.15) 0%, rgba(66,10,10,0.90) 100%)" },
  { slug: "medkom", heading: "Departemen", abbr: "Medkom", img: IMAGES.art, overlay: "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.90) 100%)" },
  { slug: "humas", heading: "Departemen", abbr: "Humas", img: IMAGES.mosque, overlay: "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.90) 100%)" },
];


export default function TentangPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="pt-12 pb-14 border-b border-neutral-200 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fcfbe6 0%, #f6f1c8 50%, #f0eaa8 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-6">
            <Link href="/" className="text-neutral-400 hover:text-[var(--color-maroon-500)] no-underline transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-neutral-600">Tentang Kami</span>
          </div>
          <motion.div {...fadeUp(0)}>
            <h1
              className="text-[32px] md:text-[42px] text-[var(--color-neutral-1000)] mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              Tentang UKM Seni Religi
            </h1>
            <p className="text-[16px] text-neutral-500 max-w-xl leading-relaxed">
              Kenali lebih dekat UKM Seni Religi Universitas Brawijaya — sejarah, visi, dan orang-orang di baliknya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div {...wiv(0)} className="relative">
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image src={IMAGES.community} alt="Komunitas" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 px-5 py-3 rounded-2xl shadow-lg"
                style={{ background: "var(--color-maroon-500)", color: "white" }}>
                <div className="text-[22px] font-extrabold">2015</div>
                <div className="text-[11px] text-white/70">Tahun Berdiri</div>
              </div>
            </motion.div>
            <div>
              <motion.span {...wiv(0.05)} className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold"
                style={{ color: "var(--color-maroon-500)" }}>
                Tentang
              </motion.span>
              <motion.h2 {...wiv(0.1)} className="text-[26px] md:text-[34px] text-[var(--color-neutral-1000)] mb-5"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Kenali Kami Lebih Dekat
              </motion.h2>
              <motion.p {...wiv(0.15)} className="text-[15px] text-neutral-600 leading-relaxed mb-4">
                UKM Seni Religi merupakan Unit Kegiatan Mahasiswa yang berdiri sejak tahun 2015 di bawah naungan Universitas Brawijaya. Organisasi ini berfokus pada pengembangan seni yang bernuansa keagamaan, menjadi wadah bagi mahasiswa untuk mengekspresikan kreativitas dalam bingkai spiritualitas.
              </motion.p>
              <motion.p {...wiv(0.2)} className="text-[15px] text-neutral-600 leading-relaxed mb-8">
                Kegiatan utama meliputi kaligrafi, nasyid, tilawah Al-Quran, puisi religi, dan seni pertunjukan islami. UKM ini terbuka untuk seluruh mahasiswa aktif Universitas Brawijaya yang memiliki minat dalam seni keagamaan.
              </motion.p>
              <motion.div {...wiv(0.25)} className="grid grid-cols-2 gap-4">
                {stats.map(({ icon: Icon, num, label, gradient }) => (
                  <div key={label} className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[20px] font-extrabold text-[var(--color-neutral-1000)]">{num}</div>
                      <div className="text-[11px] text-neutral-500">{label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission – Flip Cards */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...wiv(0)} className="text-center mb-10">
            <p className="text-[12px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: "var(--color-maroon-500)" }}>
              Arah &amp; Tujuan
            </p>
            <h2 className="text-[26px] md:text-[32px] font-bold text-[var(--color-neutral-1000)]"
              style={{ fontFamily: "var(--font-display)" }}>
              Visi &amp; Misi
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi – flips to the left */}
            <FlipCard
              direction="left"
              frontBg="linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)"
              icon={<Star size={26} color="#0d2a1a" strokeWidth={2.5} />}
              title="Visi"
              back={
                <>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#0d2a1a", marginBottom: 12 }}>
                    Visi Kami
                  </p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                    Menjadi unit kegiatan mahasiswa terdepan dalam pengembangan seni bernuansa keagamaan yang berlandaskan nilai-nilai islami dan mampu bersaing di tingkat nasional.
                  </p>
                  <div style={{ marginTop: 20, height: 2, width: 40, background: "#F59E0B", borderRadius: 2 }} />
                </>
              }
            />

            {/* Misi – flips to the right */}
            <FlipCard
              direction="right"
              frontBg="linear-gradient(135deg, #420a0a 0%, #7f1d1d 100%)"
              icon={<Award size={26} color="#420a0a" strokeWidth={2.5} />}
              title="Misi"
              back={
                <>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#420a0a", marginBottom: 14 }}>
                    Misi Kami
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Mewadahi minat dan bakat seni mahasiswa dalam bingkai islami",
                      "Mengembangkan kreativitas melalui program terstruktur",
                      "Berprestasi di tingkat regional dan nasional",
                      "Menjadi jembatan antara seni dan spiritualitas",
                    ].map((m, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                        <span style={{
                          minWidth: 20, height: 20, borderRadius: "50%",
                          background: "#991b1b", color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700, marginTop: 1,
                        }}>
                          {i + 1}
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </>
              }
            />
          </div>
          <p className="text-center text-[12px] text-neutral-400 mt-6">Arahkan kursor ke kartu untuk melihat isi</p>
        </div>
      </section>

      {/* Struktur Kepengurusan */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(135deg, #f9f9f3 0%, #f3f0e6 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <motion.span {...wiv(0)} className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--color-maroon-500)" }}>
              Organisasi
            </motion.span>
            <motion.h2 {...wiv(0.05)} className="text-[26px] md:text-[34px] text-[var(--color-neutral-1000)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Struktur Kepengurusan 2024/2025
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.abbr}
                {...wiv(i * 0.08)}
                className={dept.featured ? "sm:col-span-2" : ""}
              >
                <DeptCard {...dept} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
