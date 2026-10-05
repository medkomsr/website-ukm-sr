"use client";
import { SrSymbol } from "@/components/brand/art-symbol";
import { FIELD_ACCENTS as accents } from "@/lib/constants/home-content";
import type { SanityPrestasi } from "@/sanity/types";
import s from "@/styles/experience.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionTitle, TextLink } from "./section-heading";
gsap.registerPlugin(useGSAP, Draggable);
export function Achievements({
  tone,
  items,
  loading,
  error,
}: {
  tone: "cream" | "green";
  items: SanityPrestasi[];
  loading: boolean;
  error: boolean;
}) {
  const root = useRef<HTMLDivElement>(null),
    proxy = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const moveRef = useRef<(delta: number) => void>(() => {});
  useEffect(() => {
    moveRef.current = (delta) =>
      setIndex((v) => (items.length ? (v + delta + items.length) % items.length : 0));
  }, [items.length]);
  useGSAP(
    () => {
      if (items.length < 2) return;
      const [drag] = Draggable.create(proxy.current!, {
        type: "x",
        trigger: root.current!,
        allowNativeTouchScrolling: true,
        minimumMovement: 12,
        onDragEnd() {
          const delta = this.x - this.startX;
          if (Math.abs(delta) > 30) moveRef.current(delta < 0 ? 1 : -1);
          gsap.set(proxy.current, { x: 0 });
        },
      });
      return () => drag.kill();
    },
    { dependencies: [items.length] },
  );
  useGSAP(
    () => {
      const cards = root.current!.querySelectorAll("[data-award]");
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const gap = Math.min(innerWidth * 0.48, 295);
      cards.forEach((card, i) => {
        let offset = (i - index + items.length) % items.length;
        if (offset > items.length / 2) offset -= items.length;
        gsap.to(card, {
          x: offset * gap,
          scale: offset === 0 ? 1 : 0.82,
          rotation: offset * 5,
          opacity: Math.abs(offset) > 2 ? 0 : offset === 0 ? 1 : 0.4,
          zIndex: 10 - Math.abs(offset),
          duration: reduced ? 0 : 0.65,
          ease: "power3.out",
          overwrite: true,
        });
      });
    },
    { scope: root, dependencies: [index, items.length] },
  );
  return (
    <section
      data-tone={tone}
      data-wave
      id="publications"
      className={`${s.section} ${s.achievements}`}
    >
      <SectionTitle title="Kabar Prestasi terbaru">
        <TextLink href="/prestasi">Semua prestasi</TextLink>
      </SectionTitle>
      <div
        ref={root}
        className={s.awardStage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Prestasi Seni Religi"
        tabIndex={items.length > 1 ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            moveRef.current(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {items.length ? (
          items.map((a, i) => (
            <article
              key={a._id}
              data-award
              className={s.awardCard}
              aria-hidden={i !== index}
              inert={i !== index}
              style={{ "--accent": accents[i % 4] } as CSSProperties}
            >
              <div className={s.awardTop}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{a.year}</span>
              </div>
              <div className={s.awardPhoto}>
                {a.imageUrl ? (
                  <Image
                    src={a.imageUrl}
                    alt={a.imageAlt || a.title}
                    fill
                    sizes="(max-width: 800px) 70vw, 300px"
                  />
                ) : (
                  <span>Dokumentasi prestasi</span>
                )}
              </div>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <TextLink href="/prestasi">Lihat prestasi</TextLink>
            </article>
          ))
        ) : (
          <>
            <div className={s.awardGhost} aria-hidden="true">
              <SrSymbol index={2} />
            </div>
            <div className={s.awardGhost} aria-hidden="true">
              <SrSymbol index={0} />
            </div>
            <article className={`${s.awardCard} ${s.awardEmpty}`}>
              <span className={s.awardTop}>01</span>
              <div className={s.awardPhoto}>
                <span>Dokumentasi prestasi</span>
              </div>
              <h3>
                {loading
                  ? "Memuat jejak kami…"
                  : error
                    ? "Arsip belum dapat dimuat."
                    : "Jejak baik akan hadir di sini."}
              </h3>
              <p>
                {error
                  ? "Silakan coba muat ulang halaman."
                  : "Catatan prestasi belum dipublikasikan. Setiap pencapaian akan mendapat ruangnya."}
              </p>
              <TextLink href="/prestasi">Jelajahi prestasi</TextLink>
            </article>
          </>
        )}
      </div>
      {items.length > 0 && (
        <div className={s.carouselControls}>
          <button
            aria-label="Prestasi sebelumnya"
            disabled={items.length < 2}
            onClick={() => moveRef.current(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <span aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            aria-label="Prestasi berikutnya"
            disabled={items.length < 2}
            onClick={() => moveRef.current(1)}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
      <div ref={proxy} className={s.dragProxy} />
    </section>
  );
}
