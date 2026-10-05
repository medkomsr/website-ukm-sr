"use client";
import { SrSymbol } from "@/components/brand/art-symbol";
import StoryPreview, {
  type PreviewSelection,
} from "@/features/activities/components/story-preview";
import { statusConfig } from "@/lib/constants/home-content";
import type { SanityActivity } from "@/sanity/types";
import s from "@/styles/experience.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { SectionTitle, TextLink } from "./section-heading";
gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);
function NewsCover({ src, index }: { src: string; index: number }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 800px) 85vw, 36vw"
      onError={() => setFailed(true)}
      onLoad={() => ScrollTrigger.refresh()}
    />
  ) : (
    <div className={s.imageFallback}>
      <SrSymbol index={index} />
      <span>DOKUMENTASI SENI RELIGI</span>
    </div>
  );
}

export function NewsGallery({
  id,
  items,
  loading,
  error,
  title,
}: {
  id: string;
  items: SanityActivity[];
  loading: boolean;
  error: boolean;
  title: string;
}) {
  const [selection, setSelection] = useState<PreviewSelection | null>(null);
  const root = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null),
    viewport = useRef<HTMLDivElement>(null);
  const selectStory = (item: SanityActivity, origin: HTMLButtonElement) => {
    const image = origin
      .closest("article")
      ?.querySelector<HTMLButtonElement>("[data-home-preview-image]");
    if (!image) return;
    setSelection({ item, origin, snapshot: Flip.getState(image) });
  };
  useGSAP(
    () => {
      if (!items.length) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(viewport.current, { clearProps: "transform" });
        viewport.current!.scrollLeft = 0;
        const distance = () =>
          Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth);
        gsap.fromTo(
          track.current,
          {
            x: () => viewport.current!.clientWidth + 24,
          },
          {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              pin: true,
              start: "top -96px",
              end: () => `+=${viewport.current!.clientWidth + distance() + 24}`,
              scrub: 0.7,
              invalidateOnRefresh: true,
              refreshPriority: id === "projects" ? 3 : 1,
            },
          },
        );
      });
      mm.add("(max-width: 800px)", () => {
        gsap.set(track.current, { clearProps: "transform" });
        viewport.current!.scrollLeft = 0;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        // Move the viewport, not its scrollable track: transforming the track
        // changes its scroll bounds and makes native swipe/snap jump on mobile.
        gsap.fromTo(
          viewport.current,
          { x: () => viewport.current!.clientWidth + 24 },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              end: "top 10%",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      const refresh = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => {
        cancelAnimationFrame(refresh);
        mm.revert();
      };
    },
    { scope: root, dependencies: [items.length], revertOnUpdate: true },
  );
  return (
    <section data-tone="green" data-wave ref={root} id={id} className={`${s.section} ${s.news}`}>
      <SectionTitle title={title}>
        <TextLink href="/aktivitas">Lihat selengkapnya</TextLink>
      </SectionTitle>
      <div
        ref={viewport}
        className={s.galleryViewport}
        tabIndex={items.length ? 0 : undefined}
        aria-label="Galeri, geser untuk menjelajahi"
      >
        <div ref={track} className={s.galleryTrack}>
          {items.map((a, i) => (
            <article key={a._id} className={s.newsCard}>
              <button
                className={s.newsImage}
                data-home-preview-image
                data-flip-id={`preview-${a._id}`}
                style={{ visibility: selection?.item._id === a._id ? "hidden" : undefined }}
                onClick={(event) => selectStory(a, event.currentTarget)}
                aria-label={`Baca ringkasan ${a.title}`}
              >
                <NewsCover key={a.imageUrl} src={a.imageUrl} index={i} />
                <span className={s.imageArrow}>
                  <ArrowUpRight />
                </span>
                <span className={s.imageIndex}>0{i + 1}</span>
              </button>
              <div className={s.newsMeta}>
                <span>{a.category || (a.type === "event" ? "Acara" : "Cerita")}</span>
                <button onClick={(event) => selectStory(a, event.currentTarget)}>
                  {a.status ? statusConfig[a.status]?.label : "Baca cerita"}
                  <Plus size={12} />
                </button>
              </div>
              <button
                className={s.newsTitle}
                onClick={(event) => selectStory(a, event.currentTarget)}
              >
                {a.title}
              </button>
              <p className={s.newsDescription}>{a.description}</p>
            </article>
          ))}
          {!items.length && (
            <div className={s.emptyNews}>
              <SrSymbol index={4} />
              <h3>
                {loading
                  ? "Menyiapkan cerita…"
                  : error
                    ? "Cerita belum dapat dimuat"
                    : "Cerita berikutnya sedang dirangkai."}
              </h3>
              <p>
                {error
                  ? "Coba muat ulang halaman untuk melihat pembaruan."
                  : "Kabar dan kegiatan yang dipublikasikan akan hadir di sini."}
              </p>
              <TextLink href="/aktivitas">Jelajahi aktivitas</TextLink>
            </div>
          )}
        </div>
      </div>
      {items.length > 1 && (
        <p className={s.galleryHint}>
          Gulir atau geser untuk menjelajahi <ArrowRight size={16} />
        </p>
      )}
      <StoryPreview selection={selection} onClose={() => setSelection(null)} />
    </section>
  );
}
