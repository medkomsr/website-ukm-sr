"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import s from "@/features/departments/components/scroll-gallery.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);
export type GalleryItem = {
  title: string;
  description: string;
  image?: string;
  placeholder?: boolean;
};

export default function ScrollGallery({
  id,
  title,
  items,
  tone,
  count,
  countLabel = "PROGRAM",
  last = false,
}: {
  id: string;
  title: string;
  items: GalleryItem[];
  tone: "green" | "cream";
  count?: number;
  countLabel?: string;
  last?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const controls = useRef<(step: number) => void>(() => {});
  const [active, setActive] = useState(0);
  const uid = useId();
  useGSAP(
    () => {
      const section = root.current!;
      const stage = section.querySelector<HTMLElement>("[data-gallery-stage]")!;
      const track = section.querySelector<HTMLElement>("[data-gallery-track]")!;
      const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-gallery-card]"));
      const viewport = track.parentElement!;
      if (!cards.length) return;
      const clampIndex = gsap.utils.clamp(0, cards.length - 1);
      const proxy = section.querySelector<HTMLElement>("[data-drag-proxy]")!;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        stage.dataset.enhanced = "true";
        const playhead = { value: 0 };
        let target = 0;
        let selected = -1;
        const paint = () => {
          const next = clampIndex(Math.round(playhead.value));
          if (next !== selected) {
            selected = next;
            setActive(next);
          }
          // Keep neighboring cards inside the available column, including during a slide.
          const cardWidth = cards[0].offsetWidth;
          const spread = Math.max(
            0,
            Math.min(cardWidth * 1.12, (viewport.clientWidth - cardWidth * 0.84) / 2 - 16),
          );
          cards.forEach((card, i) => {
            const offset = i - playhead.value;
            const distance = Math.abs(offset);
            gsap.set(card, {
              x: gsap.utils.clamp(-1, 1, offset) * spread,
              scale: 1 - Math.min(distance, 1) * 0.16,
              opacity: Math.max(0, 1 - distance * 0.6),
              zIndex: Math.round(100 - distance * 10),
              visibility: distance >= 1 / 0.6 ? "hidden" : "visible",
            });
          });
        };
        const move = (value: number) => {
          target = clampIndex(value);
          gsap.to(playhead, {
            value: target,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
            onUpdate: paint,
          });
        };
        controls.current = (step) => move(Math.round(target) + step);
        paint();
        const resize = new ResizeObserver(paint);
        resize.observe(viewport);
        let startOffset = 0;
        const drag =
          cards.length > 1
            ? Draggable.create(proxy, {
                type: "x",
                trigger: track,
                allowNativeTouchScrolling: true,
                onPress() {
                  startOffset = playhead.value;
                  gsap.killTweensOf(playhead);
                },
                onDrag() {
                  target = clampIndex(
                    startOffset + (this.startX - this.x) / (cards[0].offsetWidth * 1.12),
                  );
                  playhead.value = target;
                  paint();
                },
                onDragEnd() {
                  move(Math.round(target));
                },
              })[0]
            : undefined;
        gsap.from(section.querySelectorAll("[data-gallery-reveal]"), {
          y: 65,
          opacity: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stage,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
        return () => {
          resize.disconnect();
          drag?.kill();
          gsap.killTweensOf(playhead);
          delete stage.dataset.enhanced;
          controls.current = () => {};
        };
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        let index = 0;
        setActive(0);
        const updateActive = () => {
          const center = track.getBoundingClientRect().left + track.clientWidth / 2;
          let nearest = Infinity;
          cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - center);
            if (distance < nearest) {
              nearest = distance;
              index = i;
            }
          });
          setActive(index);
        };
        controls.current = (step) => {
          index = clampIndex(index + step);
          const card = cards[index];
          const center = track.getBoundingClientRect().left + track.clientWidth / 2;
          const rect = card.getBoundingClientRect();
          track.scrollTo({
            left: track.scrollLeft + rect.left + rect.width / 2 - center,
            behavior: "instant",
          });
          setActive(index);
        };
        track.addEventListener("scroll", updateActive, { passive: true });
        return () => {
          track.removeEventListener("scroll", updateActive);
          controls.current = () => {};
        };
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [items.length, count], revertOnUpdate: true },
  );

  return (
    <section
      data-gallery-section
      ref={root}
      id={id}
      className={s.section}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <div data-panel-pin className={s.panelPin}>
        <div
          data-gallery-stage
          data-last={last || undefined}
          data-tone={tone}
          className={`${s.stage} ${count !== undefined ? s.sideLayout : ""}`}
        >
          <header className={s.heading}>
            <h2 data-gallery-reveal id={`${id}-title`}>
              {title}
            </h2>
            {count !== undefined && (
              <p data-gallery-reveal className={s.count}>
                <strong>{String(count).padStart(2, "0")}</strong>
                <span>{countLabel}</span>
              </p>
            )}
          </header>
          <div data-gallery-reveal className={s.gallery}>
            <div className={s.viewport}>
              <ul data-gallery-track id={uid} className={s.track} aria-label={title}>
                {items.map((item, i) => (
                  <li data-gallery-card className={s.card} key={`${i}-${item.title}`}>
                    <div className={s.photo}>
                      {item.image ? (
                        <Image
                          draggable={false}
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 700px) 72vw, 340px"
                        />
                      ) : (
                        <div className={s.placeholder}>
                          <ImageIcon size={46} strokeWidth={1} />
                          <span>{item.placeholder ? "Menunggu data resmi" : "Seni Religi"}</span>
                        </div>
                      )}
                    </div>
                    <div className={s.caption}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.actions}>
              <button
                disabled={items.length < 2 || active === 0}
                aria-label={`${title} sebelumnya`}
                aria-controls={uid}
                onClick={() => controls.current(-1)}
              >
                <ArrowLeft size={20} />
              </button>
              <span aria-live="polite" aria-atomic="true">
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button
                disabled={items.length < 2 || active === items.length - 1}
                aria-label={`${title} berikutnya`}
                aria-controls={uid}
                onClick={() => controls.current(1)}
              >
                <ArrowRight size={20} />
              </button>
            </div>
            {items.length > 1 && (
              <p className={s.hint}>Geser atau gunakan panah untuk menjelajahi</p>
            )}
          </div>
          <div data-drag-proxy className={s.proxy} />
        </div>
      </div>
    </section>
  );
}
