"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { usePrestasi } from "@/hooks/usePrestasi";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function StatsSection() {
  const { data: prestasi, isLoading, error } = usePrestasi();
  const items = prestasi ?? [];

  const stats = {
    total:     items.length,
    nasional:  items.filter((a) => a.level === "Nasional" || a.level === "Internasional").length,
    kompetisi: items.filter((a) => a.category === "Kompetisi").length,
    juara1:    items.filter((a) => a.position === "Juara 1").length,
  };

  return (
    <section className="py-10 bg-white border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Trophy, label: "Total Prestasi",    value: stats.total,     suffix: "+" },
            { icon: Medal,  label: "Tingkat Nasional",  value: stats.nasional,  suffix: "" },
            { icon: Award,  label: "Cabang Kompetisi",  value: stats.kompetisi, suffix: "" },
            { icon: Star,   label: "Juara 1",           value: stats.juara1,    suffix: "×" },
          ].map(({ icon: Icon, label, value, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-100"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#fef2f2,#fde3e3)" }}>
                <Icon size={20} style={{ color: "var(--color-maroon-500)" }} />
              </div>
              <div>
                <div className="text-[26px] font-extrabold text-(--color-neutral-1000) leading-none">
                  <Counter target={value} suffix={suffix} />
                </div>
                <div className="text-[12px] text-neutral-400 mt-0.5">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
