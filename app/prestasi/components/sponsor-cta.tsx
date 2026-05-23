"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal, Users, Calendar, ArrowRight } from "lucide-react";
import { usePrestasi } from "@/hooks/usePrestasi";

export default function SponsorCtaSection() {
  const { data: prestasi, isLoading, error } = usePrestasi();
  const items = prestasi ?? [];

  const juaraNasional = items.filter(
    (a) => a.position === "Juara 1" && (a.level === "Nasional" || a.level === "Internasional")
  ).length;

  return (
    <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg,#fcfbe6 0%,#f6f1c8 50%,#f0eaa8 100%)" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
        >
          <span className="inline-block text-[12px] font-bold tracking-[0.22em] uppercase mb-3"
            style={{ color: "var(--color-maroon-500)" }}>
            Sponsorship &amp; Kemitraan
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px,4vw,36px)", color: "#0d2a1a", lineHeight: 1.3, marginBottom: 14 }}>
            Bergabung Bersama Kami,{" "}
            <span style={{ color: "var(--color-maroon-500)" }}>Wujudkan Dampak Nyata</span>
          </h2>
          <p style={{ fontSize: 15, color: "#525252", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.75 }}>
            Prestasi-prestasi di atas adalah bukti nyata kualitas dan konsistensi UKM Seni Religi UB.
            Bersama mitra dan sponsor, kami siap membawa seni Islam ke panggung yang lebih luas.
          </p>

          {/* Metrics row */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { icon: Users,    label: "Anggota Aktif",  value: "150+" },
              { icon: Calendar, label: "Tahun Berdiri",  value: "11+" },
              { icon: Trophy,   label: "Total Prestasi", value: `${items.length}+` },
              { icon: Medal,    label: "Juara Nasional", value: `${juaraNasional}×` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={18} style={{ color: "var(--color-maroon-500)" }} />
                <span className="text-[24px] font-extrabold" style={{ color: "#0d2a1a" }}>{value}</span>
                <span className="text-[12px] text-neutral-500">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[14px] font-bold no-underline transition-all duration-300 hover:brightness-110 active:scale-95"
              style={{ background: "var(--color-maroon-500)", color: "white" }}
            >
              Hubungi Kami
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/tentang"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 border-2"
              style={{ borderColor: "#0d2a1a", color: "#0d2a1a" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "#0d2a1a"; el.style.color = "white"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#0d2a1a"; }}
            >
              Kenali UKM SR
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
