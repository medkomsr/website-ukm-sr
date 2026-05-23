"use client";

import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";
import type { SanityDeptDivisi, SanityDeptMember } from "@/sanity/types";
import { useDepartemenBySlug } from "@/hooks/useDepartemen";
import { notFound } from "next/navigation";

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
    "kepala-div": { w: 148, photoH: 185, initFs: 44, nameFs: 14, roleFs: 11, border: "2.5px solid #0d2a1a" },
    staff: { w: 118, photoH: 148, initFs: 34, nameFs: 12, roleFs: 10, border: "2px solid #c8d5cc" },
  }[level];

  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }}
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
            fontSize: cfg.initFs,
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
          fontSize: cfg.nameFs,
          color: "#0d2a1a",
          marginBottom: 4,
          lineHeight: 1.35,
        }}
      >
        {name}
      </p>

      {/* Role */}
      <p style={{ fontSize: cfg.roleFs, color: "#374151", lineHeight: 1.3, fontWeight: 500 }}>{role}</p>

      {/* Fakultas - Angkatan */}
      <p style={{ fontSize: cfg.roleFs - 1, color: "#9ca3af", lineHeight: 1.3, marginTop: 2 }}>
        {fakultas}
        {" – "}
        {angkatan}
      </p>
    </motion.div>
  );
}

function OrgTree({ kepala, divisi }: { kepala: SanityDeptMember; divisi: SanityDeptDivisi[] }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        {/* Row 1 — Kepala Departemen */}
        <MemberCard name={kepala.name} role={kepala.role} fakultas={kepala.fakultas} angkatan={kepala.angkatan} level="kepala-dept" delay={0} />

        {/* Row 2 — Kepala Divisi */}
        {divisi && divisi.length > 0 && (
          <div style={{ display: "flex", gap: 36, justifyContent: "center", flexWrap: "wrap" }}>
            {divisi.map((div, i) => (
              <MemberCard
                key={i}
                name={div.kepala.name}
                role={div.kepala.role}
                fakultas={div.kepala.fakultas}
                angkatan={div.kepala.angkatan}
                level="kepala-div"
                divName={div.name}
                delay={i * 0.12}
              />
            ))}
          </div>
        )}

        {/* Row 3 — Staff, grouped per divisi with a subtle gap between groups */}
        {divisi && divisi.length > 0 && (
          <div style={{ display: "flex", gap: 44, justifyContent: "center", flexWrap: "wrap" }}>
            {divisi.map((div, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                {div.staff?.map((s, j) => (
                  <MemberCard
                    key={j}
                    name={s.name}
                    role={s.role}
                    fakultas={s.fakultas}
                    angkatan={s.angkatan}
                    level="staff"
                    delay={(i * 3 + j) * 0.08}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StrukturOrganisasiSection({ dept }: { dept: string }) {
  const { data: departemen, isLoading, error } = useDepartemenBySlug(dept);

  if (!isLoading && !departemen) notFound();
  if (isLoading || !departemen?.kepala) return null;

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div {...wivTentangDept(0)} className="mb-12 text-center">
          <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
            Hierarki
          </span>
          <h2 className="text-[24px] md:text-[32px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Struktur Organisasi
          </h2>
        </motion.div>

        <OrgTree kepala={departemen.kepala} divisi={departemen.divisi || []} />
      </div>
    </section>
  );
}
