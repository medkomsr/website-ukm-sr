"use client";

import { BidangDetail } from "@/lib/bidang-data";
import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";

function BidangMemberCard({
  name,
  role,
  fakultas,
  angkatan,
  isKetua,
  delay = 0,
}: {
  name: string;
  role: string;
  fakultas: string;
  angkatan: string;
  isKetua: boolean;
  delay?: number;
}) {
  const w = isKetua ? 170 : 148;
  const photoH = isKetua ? 210 : 185;
  const initFs = isKetua ? 52 : 44;
  const nameFs = isKetua ? 15 : 14;
  const roleFs = isKetua ? 12 : 11;
  const border = isKetua ? "3px solid #F59E0B" : "2.5px solid #7f1d1d";

  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }}
      style={{ width: w, textAlign: "center", flexShrink: 0 }}
    >
      {/* Portrait card */}
      <div
        style={{
          width: w,
          height: photoH,
          borderRadius: 16,
          background: "linear-gradient(160deg, #1e2a3a 0%, #2c3e50 65%, #1a2535 100%)",
          border,
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
        {/* Islamic pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("/element-islamic.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.06,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: initFs,
            color: "rgba(255,255,255,0.88)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {initials}
        </span>
      </div>

      {/* Name */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: nameFs,
          color: "#0d2a1a",
          marginBottom: 4,
          lineHeight: 1.35,
        }}
      >
        {name}
      </p>

      {/* Role */}
      <p style={{ fontSize: roleFs, color: "#374151", lineHeight: 1.3, fontWeight: 500 }}>
        {role}
      </p>

      {/* Fakultas – Angkatan */}
      <p style={{ fontSize: roleFs - 1, color: "#9ca3af", lineHeight: 1.3, marginTop: 2 }}>
        {fakultas} – {angkatan}
      </p>
    </motion.div>
  );
}

export default function StrukturSection({ data }: { data: BidangDetail }) {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div {...wivTentangDept(0)} className="mb-12 text-center">
          <span
            className="text-[12px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "var(--color-maroon-500)" }}
          >
            Hierarki
          </span>
          <h2
            className="text-[24px] md:text-[32px] mt-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Struktur Kepengurusan
          </h2>
        </motion.div>

        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <BidangMemberCard
            name={data.ketuaBidang.name}
            role={data.ketuaBidang.role}
            fakultas={data.ketuaBidang.fakultas}
            angkatan={data.ketuaBidang.angkatan}
            isKetua={true}
            delay={0}
          />
          <BidangMemberCard
            name={data.wakilKetuaBidang.name}
            role={data.wakilKetuaBidang.role}
            fakultas={data.wakilKetuaBidang.fakultas}
            angkatan={data.wakilKetuaBidang.angkatan}
            isKetua={false}
            delay={0.15}
          />
        </div>
      </div>
    </section>
  );
}
