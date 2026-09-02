"use client";

import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDepartemenBySlug } from "@/hooks/useDepartemen";
import { notFound } from "next/navigation";

function ProgramCard({ title, description, i }: { title: string; description: string; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const isGreen = i % 2 === 0;
  const frontBg = isGreen ? "linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)" : "linear-gradient(135deg, #420a0a 0%, #7f1d1d 100%)";
  const accentColor = isGreen ? "#34d399" : "#fca5a5";

  return (
    <motion.div {...wivTentangDept(i * 0.07)}>
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
            <p
              style={{
                color: "white",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                lineHeight: 1.45,
              }}
            >
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
            <div
              style={{
                position: "relative",
                height: "100%",
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0d2a1a",
                  opacity: 0.5,
                }}
              >
                Program Kerja
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#374151",
                  lineHeight: 1.6,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
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

export default function ProgramKerjaSection({ dept }: { dept: string }) {
  const { data: departemen, isLoading } = useDepartemenBySlug(dept);

  if (!isLoading && !departemen) notFound();

  return (
    <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, #f9f9f3 0%, #f3f0e6 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div {...wivTentangDept(0)} className="mb-10">
          <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-maroon-500)" }}>
            Kegiatan
          </span>
          <h2 className="text-[24px] md:text-[32px] mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Program Kerja
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departemen?.programItems?.map((program, i) => (
            <ProgramCard key={program._key ?? `${program.title}-${i}`} title={program.title} description={program.description} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
