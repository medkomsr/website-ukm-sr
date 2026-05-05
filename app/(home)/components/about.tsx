"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Users, Award, CalendarDays, ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/data";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const highlights = [
  { icon: Users, text: "150+ Anggota dari Seluruh Fakultas" },
  { icon: Award, text: "25+ Penghargaan Tingkat Nasional" },
  { icon: CalendarDays, text: "50+ Kegiatan Setiap Tahun" },
];

function LogoGlassCard() {
  // Mouse position normalized to [-0.5, 0.5]
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Reflection visibility (0 → 1 on hover)
  const reflectionOpacity = useMotionValue(0);
  const smoothReflectionOpacity = useSpring(reflectionOpacity, {
    stiffness: 180,
    damping: 28,
  });

  // Smooth springs for tilt
  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), springConfig);

  // Logo floats with cursor (subtle parallax)
  const logoX = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), springConfig);
  const logoY = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), springConfig);

  // Cursor position as percentage (0-100%) for cursor-tracking reflection
  const cursorPctX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const cursorPctY = useTransform(my, [-0.5, 0.5], [0, 100]);

  // Smooth-following reflection position (slight lag for fluid feel)
  const smoothPctX = useSpring(cursorPctX, { stiffness: 260, damping: 26 });
  const smoothPctY = useSpring(cursorPctY, { stiffness: 260, damping: 26 });

  // Main bright spot — follows cursor
  const reflectionBg = useMotionTemplate`radial-gradient(circle at ${smoothPctX}% ${smoothPctY}%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.55) 10%, rgba(255,255,255,0.22) 25%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0) 60%)`;

  // Secondary softer ambient glow — slightly offset for layered glass feel
  const ambientBg = useMotionTemplate`radial-gradient(ellipse 60% 45% at ${smoothPctX}% ${smoothPctY}%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0) 70%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleEnter() {
    reflectionOpacity.set(1);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
    reflectionOpacity.set(0);
  }

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className="relative h-[420px] flex items-center justify-center will-change-transform"
    >
      {/* Logo — fills the area, floats with cursor */}
      <motion.div
        className="relative"
        style={{
          x: logoX,
          y: logoY,
          width: 420,
          height: 420,
          filter:
            "drop-shadow(0 24px 40px rgba(127,29,29,0.25)) drop-shadow(0 12px 20px rgba(13,42,26,0.15)) drop-shadow(0 4px 8px rgba(0,0,0,0.08))",
        }}
      >
        <Image
          src="/logo.png"
          alt="UKM Seni Religi Logo"
          fill
          sizes="420px"
          className="object-contain"
          priority
        />

        {/* Cursor-tracking reflections — only visible on hover, follow cursor position */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: "circle(48.5% at 50% 50%)",
            opacity: smoothReflectionOpacity,
          }}
        >
          {/* Soft ambient glow — wider, fainter, follows cursor */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: ambientBg,
              mixBlendMode: "screen",
            }}
          />
          {/* Sharp bright spot — main reflection at cursor */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: reflectionBg,
              mixBlendMode: "screen",
              filter: "blur(1px)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PhotoCard() {
  return (
    <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(13,42,26,0.18),0_8px_16px_-8px_rgba(127,29,29,0.10)]">
      <Image
        src={IMAGES.community}
        alt="Komunitas UKM Seni Religi"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      {/* Subtle bottom gradient for editorial feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(13,42,26,0.32) 0%, rgba(13,42,26,0.08) 35%, rgba(13,42,26,0) 60%)",
        }}
      />
    </div>
  );
}

export default function AboutSection({ variant = "logo", hideCta = false }: { variant?: "logo" | "image"; hideCta?: boolean }) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Visual: logo glass card on home, photo on /tentang */}
          <motion.div
            {...fadeUp}
            className="relative"
            style={variant === "logo" ? { perspective: 1200 } : undefined}
          >
            {variant === "logo" ? <LogoGlassCard /> : <PhotoCard />}
          </motion.div>

          {/* Text */}
          <div>
            <motion.span
              {...fadeUp}
              className="inline-block text-[13px] tracking-[0.2em] uppercase mb-4 font-bold"
              style={{ color: "var(--color-maroon-500)" }}
            >
              Tentang Kami
            </motion.span>
            <motion.h2
              {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.1 } }}
              className="text-[30px] md:text-[42px] text-(--color-neutral-1000) mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              Hidup itu Seni, Seni itu Indah,{" "}
              <span style={{ color: "var(--color-maroon-500)" }}>Indah itu Baik, Yang Baik Disenangi</span>
            </motion.h2>
            <motion.p
              {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.15 } }}
              className="text-[15px] text-neutral-600 leading-relaxed mb-4"
            >
              UKM Seni Religi adalah Unit Kegiatan Mahasiswa yang berdiri sejak tahun 2015, berfokus pada pengembangan seni bernuansa keagamaan. Kami
              mewadahi minat dan bakat mahasiswa dalam kaligrafi, nasyid, tilawah, puisi religi, dan seni pertunjukan islami.
            </motion.p>
            <motion.p
              {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.2 } }}
              className="text-[15px] text-neutral-600 leading-relaxed mb-8"
            >
              Dengan lebih dari 150 anggota aktif dan puluhan kegiatan setiap tahunnya, kami berkomitmen menjadi wadah kreativitas yang berlandaskan
              nilai-nilai islami.
            </motion.p>

            {/* Highlights */}
            <motion.div {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.25 } }} className="space-y-3 mb-8">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "color-mix(in srgb, var(--color-maroon-500) 10%, transparent)" }}
                  >
                    <Icon size={15} style={{ color: "var(--color-maroon-500)" }} />
                  </div>
                  <span className="text-[14px] text-neutral-700">{text}</span>
                </div>
              ))}
            </motion.div>

            {!hideCta && (
              <motion.div {...{ ...fadeUp, transition: { ...fadeUp.transition, delay: 0.3 } }}>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 hover:opacity-90"
                  style={{ background: "var(--color-maroon-500)", color: "white" }}
                >
                  Selengkapnya Tentang Kami
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
