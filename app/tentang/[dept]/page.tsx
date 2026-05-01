"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SiteLayout from "@/components/site-layout";
import { DEPT_DATA, DeptMember, DeptDivisi } from "@/lib/data";

const wiv = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

function MemberCard({
  name,
  role,
  fakultas,
  angkatan,
  level,
  delay = 0,
}: {
  name: string;
  role: string;
  fakultas: string;
  angkatan: string;
  level: "kepala-dept" | "kepala-div" | "staff";
  divName?: string;
  delay?: number;
}) {
  const cfg = {
    "kepala-dept": { w: 170, photoH: 210, initFs: 52, nameFs: 15, roleFs: 12, border: "3px solid #F59E0B" },
    "kepala-div":  { w: 148, photoH: 185, initFs: 44, nameFs: 14, roleFs: 11, border: "2.5px solid #0d2a1a" },
    "staff":       { w: 118, photoH: 148, initFs: 34, nameFs: 12, roleFs: 10, border: "2px solid #c8d5cc" },
  }[level];

  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: cfg.w, textAlign: "center", flexShrink: 0 }}
    >
      {/* Portrait photo card */}
      <div
        style={{
          width: cfg.w,
          height: cfg.photoH,
          borderRadius: 16,
          background: "linear-gradient(160deg, #1e2a3a 0%, #2c3e50 65%, #1a2535 100%)",
          border: cfg.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          boxShadow: "0 6px 24px rgba(0,0,0,0.13)",
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-5px)";
          el.style.boxShadow = "0 16px 36px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "0 6px 24px rgba(0,0,0,0.13)";
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("/element-islamic.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
        }} />
        <span style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: cfg.initFs,
          color: "rgba(255,255,255,0.88)",
          position: "relative",
          zIndex: 1,
        }}>
          {initials}
        </span>
      </div>

      {/* Name */}
      <p style={{
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: cfg.nameFs,
        color: "#0d2a1a",
        marginBottom: 4,
        lineHeight: 1.35,
      }}>
        {name}
      </p>

      {/* Role */}
      <p style={{ fontSize: cfg.roleFs, color: "#374151", lineHeight: 1.3, fontWeight: 500 }}>
        {role}
      </p>

      {/* Fakultas - Angkatan */}
      <p style={{ fontSize: cfg.roleFs - 1, color: "#9ca3af", lineHeight: 1.3, marginTop: 2 }}>
        {fakultas}{" – "}{angkatan}
      </p>
    </motion.div>
  );
}

function OrgTree({ kepala, divisi }: { kepala: DeptMember; divisi: DeptDivisi[] }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>

        {/* Row 1 — Kepala Departemen */}
        <MemberCard name={kepala.name} role={kepala.role} fakultas={kepala.fakultas} angkatan={kepala.angkatan} level="kepala-dept" delay={0} />

        {/* Row 2 — Kepala Divisi */}
        <div style={{ display: "flex", gap: 36, justifyContent: "center", flexWrap: "wrap" }}>
          {divisi.map((div, i) => (
            <MemberCard key={i} name={div.kepala.name} role={div.kepala.role} fakultas={div.kepala.fakultas} angkatan={div.kepala.angkatan} level="kepala-div" divName={div.name} delay={i * 0.12} />
          ))}
        </div>

        {/* Row 3 — Staff, grouped per divisi with a subtle gap between groups */}
        <div style={{ display: "flex", gap: 44, justifyContent: "center", flexWrap: "wrap" }}>
          {divisi.map((div, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              {div.staff.map((s, j) => (
                <MemberCard key={j} name={s.name} role={s.role} fakultas={s.fakultas} angkatan={s.angkatan} level="staff" delay={(i * 3 + j) * 0.08} />
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function ProgramCard({ title, description, i }: { title: string; description: string; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const isGreen = i % 2 === 0;
  const frontBg = isGreen
    ? "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)"
    : "linear-gradient(135deg, #420a0a 0%, #7f1d1d 100%)";
  const accentColor = isGreen ? "#34d399" : "#fca5a5";

  return (
    <motion.div {...wiv(i * 0.07)}>
      <div
        style={{ perspective: "1200px", height: 200, cursor: "pointer" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: frontBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 20px",
            }}
          >
            <p style={{
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              textAlign: "center",
              lineHeight: 1.45,
            }}>
              {title}
            </p>
          </div>

          {/* Back */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              overflow: "hidden",
              background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("/element-islamic.png")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.05,
              }}
            />
            <div style={{
              position: "relative",
              height: "100%",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0d2a1a",
                opacity: 0.5,
              }}>
                Program Kerja
              </p>
              <p style={{
                fontSize: 12.5,
                color: "#374151",
                lineHeight: 1.6,
                flex: 1,
                display: "flex",
                alignItems: "center",
                padding: "10px 0",
              }}>
                {description}
              </p>
              <div style={{ height: 3, borderRadius: 99, background: accentColor, width: 40 }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DeptDetailPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = use(params);
  const data = DEPT_DATA[dept];
  if (!data) notFound();

  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <Image src={data.img} alt={data.abbr} fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: data.overlay }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-[12px] text-white/60 mb-8"
          >
            <Link href="/" className="text-white/60 hover:text-white no-underline transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <Link href="/tentang" className="text-white/60 hover:text-white no-underline transition-colors">Tentang</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">{data.abbr}</span>
          </motion.div>

          {/* Labels + title */}
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#F59E0B" }}
          >
            {data.heading}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className="text-[36px] md:text-[52px] leading-tight text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, maxWidth: 640 }}
          >
            {data.fullName}
          </motion.h1>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14">
            <path d="M0,30 C360,60 720,0 1080,40 C1260,55 1350,45 1440,35 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Description ──────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p {...wiv(0)} className="text-[16px] md:text-[18px] text-neutral-600 leading-relaxed">
              {data.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Program Kerja ─────────────────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, #f9f9f3 0%, #f3f0e6 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...wiv(0)} className="mb-10">
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
              Kegiatan
            </span>
            <h2 className="text-[24px] md:text-[32px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Program Kerja
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.programs.map((p, i) => (
              <ProgramCard key={i} title={p} description={data.programDescriptions[i]} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Struktur Organisasi ───────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...wiv(0)} className="mb-12 text-center">
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
              Hierarki
            </span>
            <h2 className="text-[24px] md:text-[32px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Struktur Organisasi
            </h2>
          </motion.div>

          <OrgTree kepala={data.kepala} divisi={data.divisi} />
        </div>
      </section>

      {/* ── Back button ───────────────────────────────────────────── */}
      <section className="py-10 bg-white border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <Link
            href="/tentang"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold no-underline transition-all duration-300 border-2"
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
            ← Kembali ke Tentang Kami
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
