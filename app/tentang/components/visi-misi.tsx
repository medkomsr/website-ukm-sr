"use client";

import { wivTentang } from "@/lib/utils";
import { motion } from "framer-motion";
import { Award, Star } from "lucide-react";
import { useState } from "react";

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

export default function VisiMisiSection() {
  return (
    <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div {...wivTentang(0)} className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: "var(--color-maroon-500)" }}>
            Arah &amp; Tujuan
          </p>
          <h2 className="text-[26px] md:text-[32px] font-bold text-(--color-neutral-1000)" style={{ fontFamily: "var(--font-display)" }}>
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
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#0d2a1a", marginBottom: 12 }}>Visi Kami</p>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                  Menjadi unit kegiatan mahasiswa terdepan dalam pengembangan seni bernuansa keagamaan yang berlandaskan nilai-nilai islami dan mampu
                  bersaing di tingkat nasional.
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
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#420a0a", marginBottom: 14 }}>Misi Kami</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Mewadahi minat dan bakat seni mahasiswa dalam bingkai islami",
                    "Mengembangkan kreativitas melalui program terstruktur",
                    "Berprestasi di tingkat regional dan nasional",
                    "Menjadi jembatan antara seni dan spiritualitas",
                  ].map((m, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                      <span
                        style={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#991b1b",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          marginTop: 1,
                        }}
                      >
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
  );
}
