"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar, Clock, MapPin, Users, Tag, ChevronRight,
  ArrowLeft, User, BookOpen, CheckCircle2, Circle,
} from "lucide-react";
import SiteLayout from "@/components/site-layout";
import { activities, Activity } from "@/lib/data";

const wiv = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const statusConfig = {
  upcoming: { label: "Akan Datang", bg: "#84cc16", text: "#14532d" },
  ongoing:  { label: "Berlangsung", bg: "#facc15", text: "#92400e" },
  completed:{ label: "Selesai",     bg: "#e5e5e5", text: "#525252" },
} as const;

function InfoPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <motion.div
      {...wiv(0)}
      className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-100"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fde3e3 100%)" }}
      >
        <Icon size={16} style={{ color: "var(--color-maroon-500)" }} />
      </div>
      <div>
        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, color: "#111827", fontWeight: 600, lineHeight: 1.4 }}>{value}</p>
      </div>
    </motion.div>
  );
}

function AgendaSection({ agenda }: { agenda: Activity["agenda"] }) {
  if (!agenda?.length) return null;
  return (
    <motion.div {...wiv(0)}>
      <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>Rundown</span>
      <h2 className="text-[22px] md:text-[28px] mt-1 mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
        Jadwal Acara
      </h2>
      <div className="relative">
        <div className="absolute left-[18px] top-2 bottom-2 w-px" style={{ background: "linear-gradient(to bottom, var(--color-maroon-200), transparent)" }} />
        <div className="space-y-3 pl-10">
          {agenda.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-100 hover:border-[color-mix(in_srgb,var(--color-maroon-500)_25%,transparent)] hover:shadow-md transition-all duration-300"
            >
              <div
                className="absolute -left-[calc(2.5rem-2px)] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ background: "white", borderColor: "var(--color-maroon-300)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-maroon-500)" }} />
              </div>
              <span
                className="flex-shrink-0 text-[12px] font-bold tabular-nums"
                style={{ color: "var(--color-maroon-500)", minWidth: 110 }}
              >
                {row.time}
              </span>
              <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{row.item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ArticleBody({ body }: { body: string[] }) {
  return (
    <div className="space-y-5">
      {body.map((para, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          style={{ fontSize: 16, color: "#374151", lineHeight: 1.8 }}
        >
          {para}
        </motion.p>
      ))}
    </div>
  );
}

function RelatedCard({ item }: { item: Activity }) {
  const isEvent = item.type === "event";
  const st = item.status ? statusConfig[item.status] : null;
  return (
    <Link href={`/aktivitas/${item.id}`} className="no-underline" style={{ display: "block" }}>
      <div className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:border-[color-mix(in_srgb,var(--color-maroon-500)_30%,transparent)] hover:shadow-xl hover:-translate-y-1 transition-all duration-400 cursor-pointer">
        <div className="relative h-40 overflow-hidden">
          <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-sm"
              style={{ background: isEvent ? "rgba(153,27,27,0.9)" : "rgba(255,255,255,0.9)", color: isEvent ? "white" : "#262626" }}>
              {isEvent ? "Kegiatan" : "Artikel"}
            </span>
            {isEvent && st && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: st.bg, color: st.text }}>{st.label}</span>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[11px] text-neutral-400 mb-1.5 flex items-center gap-1"><Calendar size={10} />{item.date}</p>
          <h4 className="text-[13px] font-bold text-[var(--color-neutral-1000)] leading-snug group-hover:text-[var(--color-maroon-500)] transition-colors line-clamp-2">
            {item.title}
          </h4>
        </div>
      </div>
    </Link>
  );
}

export default function AktivitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = activities.find((a) => a.id === id);
  if (!item) notFound();

  const isEvent = item.type === "event";
  const st = item.status ? statusConfig[item.status] : null;

  const related = activities
    .filter((a) => a.id !== item.id && (a.category === item.category || a.type === item.type))
    .slice(0, 3);

  const overlayGradient = isEvent
    ? "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.88) 100%)"
    : "linear-gradient(to bottom, rgba(66,10,10,0.10) 0%, rgba(66,10,10,0.85) 100%)";

  return (
    <SiteLayout>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
        <Image src={item.image} alt={item.title} fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: overlayGradient }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16 flex flex-col h-full" style={{ minHeight: 480 }}>
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-[12px] text-white/60 mb-auto"
          >
            <Link href="/" className="text-white/60 hover:text-white no-underline transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <Link href="/aktivitas" className="text-white/60 hover:text-white no-underline transition-colors">Kegiatan &amp; Aktivitas</Link>
            <ChevronRight size={12} />
            <span className="text-white/90 line-clamp-1 max-w-[200px]">{item.title}</span>
          </motion.div>

          {/* Badge row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 mb-4 mt-8"
          >
            <span className="px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm"
              style={{ background: isEvent ? "rgba(153,27,27,0.85)" : "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              {isEvent ? "Kegiatan" : "Artikel"}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
              {item.category}
            </span>
            {isEvent && st && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: st.bg, color: st.text }}>
                {st.label}
              </span>
            )}
            {!isEvent && item.readTime && (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                <BookOpen size={10} /> {item.readTime} baca
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className="text-[32px] md:text-[48px] leading-tight text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, maxWidth: 760, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {item.title}
          </motion.h1>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-wrap items-center gap-4 mt-4 text-[13px] text-white/75"
          >
            <span className="flex items-center gap-1.5"><Calendar size={13} />{item.date}</span>
            {isEvent && item.time && <span className="flex items-center gap-1.5"><Clock size={13} />{item.time}</span>}
            {!isEvent && item.author && <span className="flex items-center gap-1.5"><User size={13} />{item.author.name}</span>}
            {isEvent && item.location && <span className="flex items-center gap-1.5"><MapPin size={13} />{item.location}</span>}
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full" style={{ height: 56, display: "block" }}>
            <path d="M0,28 C360,56 720,0 1080,36 C1260,50 1350,42 1440,32 L1440,56 L0,56 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">

            {/* Left: Main content */}
            <div>
              {/* Description intro */}
              <motion.div {...wiv(0)} className="mb-10">
                <p
                  className="text-[17px] md:text-[18px] leading-relaxed"
                  style={{ color: "#374151", borderLeft: "3px solid var(--color-maroon-400)", paddingLeft: 20 }}
                >
                  {item.longDescription ?? item.description}
                </p>
              </motion.div>

              {/* Article body */}
              {!isEvent && item.body && (
                <motion.div {...wiv(0.05)} className="mb-12">
                  <ArticleBody body={item.body} />
                </motion.div>
              )}

              {/* Agenda */}
              {isEvent && item.agenda && (
                <div className="mb-12">
                  <AgendaSection agenda={item.agenda} />
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <motion.div {...wiv(0.1)} className="flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-100">
                  <Tag size={13} style={{ color: "#9ca3af" }} />
                  {item.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-[12px] font-medium transition-colors duration-200 cursor-default hover:bg-[color-mix(in_srgb,var(--color-maroon-500)_12%,transparent)]"
                      style={{ background: "#f5f5f5", color: "#525252" }}>
                      {t}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Author card (articles) */}
              {!isEvent && item.author && (
                <motion.div
                  {...wiv(0.12)}
                  className="mt-8 p-5 rounded-2xl flex items-center gap-4"
                  style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #eaf5ee 100%)", border: "1px solid #d1fae5" }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white" }}>
                      {item.author.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0d2a1a" }}>{item.author.name}</p>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{item.author.role}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24 self-start">
              {/* Info pills */}
              <InfoPill icon={Calendar} label="Tanggal" value={item.date} />
              {isEvent && item.time && <InfoPill icon={Clock} label="Waktu" value={item.time} />}
              {isEvent && item.location && <InfoPill icon={MapPin} label="Lokasi" value={item.location} />}
              {isEvent && item.organizer && <InfoPill icon={Users} label="Penyelenggara" value={item.organizer} />}
              {isEvent && item.maxParticipants && (
                <InfoPill icon={Users} label="Kapasitas" value={`${item.maxParticipants} peserta`} />
              )}
              {!isEvent && item.readTime && <InfoPill icon={BookOpen} label="Waktu Baca" value={item.readTime} />}
              {!isEvent && item.author && <InfoPill icon={User} label="Penulis" value={item.author.name} />}

              {/* CTA */}
              {isEvent && item.status === "upcoming" && (
                <motion.div
                  {...wiv(0.1)}
                  className="p-5 rounded-2xl text-center"
                  style={{ background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)" }}
                >
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 12 }}>
                    Jangan lewatkan acara ini!
                  </p>
                  <button
                    className="w-full py-3 rounded-xl text-[13px] font-bold cursor-pointer border-none transition-all duration-300 hover:brightness-110 active:scale-95"
                    style={{ background: "linear-gradient(135deg, var(--color-maroon-600) 0%, var(--color-maroon-500) 100%)", color: "white" }}
                  >
                    Daftar Sekarang
                  </button>
                  {item.maxParticipants && (
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
                      Kapasitas terbatas {item.maxParticipants} peserta
                    </p>
                  )}
                </motion.div>
              )}

              {isEvent && item.status === "completed" && (
                <motion.div
                  {...wiv(0.1)}
                  className="p-5 rounded-2xl flex items-center gap-3"
                  style={{ background: "#f5f5f5" }}
                >
                  <CheckCircle2 size={18} style={{ color: "#9ca3af" }} />
                  <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Acara ini telah selesai diselenggarakan.</p>
                </motion.div>
              )}

              {isEvent && item.status === "ongoing" && (
                <motion.div
                  {...wiv(0.1)}
                  className="p-5 rounded-2xl flex items-center gap-3"
                  style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)", border: "1px solid #fde68a" }}
                >
                  <Circle size={14} className="animate-pulse" style={{ color: "#d97706", fill: "#fbbf24" }} />
                  <p style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>Sedang berlangsung</p>
                </motion.div>
              )}

              {/* Back button */}
              <Link
                href="/aktivitas"
                className="no-underline flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold border-2 transition-all duration-300 hover:bg-[var(--color-neutral-1000)] hover:text-white hover:border-[var(--color-neutral-1000)]"
                style={{ borderColor: "#e5e5e5", color: "#525252" }}
              >
                <ArrowLeft size={14} />
                Kembali ke Aktivitas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related ───────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 border-t border-neutral-100" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 100%)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <motion.div {...wiv(0)} className="mb-8">
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
                Lainnya
              </span>
              <h2 className="text-[22px] md:text-[28px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Kegiatan &amp; Artikel Terkait
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((a, i) => (
                <motion.div key={a.id} {...wiv(i * 0.08)}>
                  <RelatedCard item={a} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
