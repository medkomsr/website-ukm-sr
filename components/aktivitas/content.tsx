"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag, User, BookOpen, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { Activity } from "@/lib/data";
import { wivGeneral } from "@/lib/utils";

function InfoPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <motion.div
      {...wivGeneral(0)}
      className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-100"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fde3e3 100%)" }}
      >
        <Icon size={16} style={{ color: "var(--color-maroon-500)" }} />
      </div>
      <div>
        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
          {label}
        </p>
        <p style={{ fontSize: 14, color: "#111827", fontWeight: 600, lineHeight: 1.4 }}>{value}</p>
      </div>
    </motion.div>
  );
}

function AgendaSection({ agenda }: { agenda: Activity["agenda"] }) {
  if (!agenda?.length) return null;
  return (
    <motion.div {...wivGeneral(0)}>
      <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
        Rundown
      </span>
      <h2 className="text-[22px] md:text-[28px] mt-1 mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
        Jadwal Acara
      </h2>
      <div className="relative">
        <div
          className="absolute left-[18px] top-2 bottom-2 w-px"
          style={{ background: "linear-gradient(to bottom, var(--color-maroon-200), transparent)" }}
        />
        <div className="space-y-3 pl-10">
          {agenda.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-100 hover:border-[color-mix(in_srgb,var(--color-maroon-500)_25%,transparent)] hover:shadow-md transition-all duration-300"
            >
              <div
                className="absolute -left-[calc(2.5rem-2px)] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ background: "white", borderColor: "var(--color-maroon-300)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-maroon-500)" }} />
              </div>
              <span className="shrink-0 text-[12px] font-bold tabular-nums" style={{ color: "var(--color-maroon-500)", minWidth: 110 }}>
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

export default function ContentSection({ item, isEvent }: { item: Activity; isEvent: boolean }) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          {/* Left: Main content */}
          <div>
            {/* Description intro */}
            <motion.div {...wivGeneral(0)} className="mb-10">
              <p
                className="text-[17px] md:text-[18px] leading-relaxed"
                style={{ color: "#374151", borderLeft: "3px solid var(--color-maroon-400)", paddingLeft: 20 }}
              >
                {item.longDescription ?? item.description}
              </p>
            </motion.div>

            {/* Article body */}
            {!isEvent && item.body && (
              <motion.div {...wivGeneral(0.05)} className="mb-12">
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
              <motion.div {...wivGeneral(0.1)} className="flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-100">
                <Tag size={13} style={{ color: "#9ca3af" }} />
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-[12px] font-medium transition-colors duration-200 cursor-default hover:bg-[color-mix(in_srgb,var(--color-maroon-500)_12%,transparent)]"
                    style={{ background: "#f5f5f5", color: "#525252" }}
                  >
                    {t}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Author card (articles) */}
            {!isEvent && item.author && (
              <motion.div
                {...wivGeneral(0.12)}
                className="mt-8 p-5 rounded-2xl flex items-center gap-4"
                style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #eaf5ee 100%)", border: "1px solid #d1fae5" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)" }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white" }}>
                    {item.author.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
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
            {isEvent && item.maxParticipants && <InfoPill icon={Users} label="Kapasitas" value={`${item.maxParticipants} peserta`} />}
            {!isEvent && item.readTime && <InfoPill icon={BookOpen} label="Waktu Baca" value={item.readTime} />}
            {!isEvent && item.author && <InfoPill icon={User} label="Penulis" value={item.author.name} />}

            {/* CTA */}
            {isEvent && item.status === "upcoming" && (
              <motion.div
                {...wivGeneral(0.1)}
                className="p-5 rounded-2xl text-center"
                style={{ background: "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)" }}
              >
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 12 }}>Jangan lewatkan acara ini!</p>
                <button
                  className="w-full py-3 rounded-xl text-[13px] font-bold cursor-pointer border-none transition-all duration-300 hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, var(--color-maroon-600) 0%, var(--color-maroon-500) 100%)", color: "white" }}
                >
                  Daftar Sekarang
                </button>
                {item.maxParticipants && (
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>Kapasitas terbatas {item.maxParticipants} peserta</p>
                )}
              </motion.div>
            )}

            {isEvent && item.status === "completed" && (
              <motion.div {...wivGeneral(0.1)} className="p-5 rounded-2xl flex items-center gap-3" style={{ background: "#f5f5f5" }}>
                <CheckCircle2 size={18} style={{ color: "#9ca3af" }} />
                <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Acara ini telah selesai diselenggarakan.</p>
              </motion.div>
            )}

            {isEvent && item.status === "ongoing" && (
              <motion.div
                {...wivGeneral(0.1)}
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
              className="no-underline flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold border-2 transition-all duration-300 hover:bg-(--color-neutral-1000) hover:text-white hover:border-(--color-neutral-1000)"
              style={{ borderColor: "#e5e5e5", color: "#525252" }}
            >
              <ArrowLeft size={14} />
              Kembali ke Aktivitas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
