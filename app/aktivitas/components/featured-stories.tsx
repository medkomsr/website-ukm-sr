"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StoryImage from "./story-image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { SanityActivity } from "@/sanity/types";
import s from "./newsroom.module.css";

gsap.registerPlugin(useGSAP);

export default function FeaturedStories({ items }: { items: SanityActivity[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const current = useRef(0);
  const direction = useRef(1);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const animating = useRef(false);
  const multiple = items.length > 1;
  const running = multiple && !hovered && !focused && visible && !reduced;

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(preference.matches);
    let inView = true;
    const syncVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    }, { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    syncMotion();
    syncVisibility();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  function goTo(index: number, step = 1) {
    const next = (index + items.length) % items.length;
    if (animating.current || next === current.current) return;
    direction.current = step;
    setActive(next);
  }

  useGSAP(() => {
    const slides = gsap.utils.toArray<HTMLElement>("[data-story]", root.current);
    const previous = current.current;
    current.current = active;
    const next = slides[active];
    if (!next) return;
    if (previous === active || reduced) {
      gsap.set(slides, { autoAlpha: 0, xPercent: 0 });
      gsap.set(next, { autoAlpha: 1 });
      animating.current = false;
      return;
    }
    animating.current = true;
    const outgoing = slides[previous];
    const step = direction.current;
    gsap.set(slides, { zIndex: 0, autoAlpha: 0, xPercent: 0 });
    gsap.set(outgoing, { autoAlpha: 1 });
    gsap.set(next, { autoAlpha: 1, zIndex: 2 });
    const timeline = gsap.timeline({ onComplete: () => {
      gsap.set(outgoing, { autoAlpha: 0 });
      animating.current = false;
    } });
    timeline
      .fromTo(next, { xPercent: step * 100 }, { xPercent: 0, duration: 1.15, ease: "power3.inOut" }, 0)
      .to(outgoing, { xPercent: -step * 24, duration: 1.15, ease: "power3.inOut" }, 0)
      .fromTo(next.querySelector("[data-story-image]"), { xPercent: -step * 20, scale: 1.12 }, { xPercent: 0, scale: 1, duration: 1.4, ease: "power3.out" }, 0)
      .fromTo(next.querySelectorAll("[data-story-copy]"), { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.09, ease: "power3.out" }, 0.45);
    return () => { animating.current = false; };
  }, { scope: root, dependencies: [active, reduced], revertOnUpdate: true });

  useGSAP(() => {
    if (!running) return;
    gsap.delayedCall(7, () => {
      direction.current = 1;
      setActive((index) => (index + 1) % items.length);
    });
  }, { scope: root, dependencies: [active, running, items.length], revertOnUpdate: true });

  return (
    <section ref={root} className={s.featured} data-tone="green" aria-label="Sorotan berita dan acara" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const step = event.key === "ArrowRight" ? 1 : -1;
          goTo(active + step, step);
        }
      }}>
      <div className={s.stage}
        onPointerDown={(event) => { if (event.pointerType !== "mouse") pointer.current = { x: event.clientX, y: event.clientY }; }}
        onPointerCancel={() => { pointer.current = null; }}
        onPointerUp={(event) => {
          if (!pointer.current) return;
          const dx = event.clientX - pointer.current.x;
          const dy = event.clientY - pointer.current.y;
          pointer.current = null;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) goTo(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        }}>
        {items.map((item, index) => (
          <article key={item._id} data-story className={s.slide} data-active={index === active} aria-hidden={index !== active} inert={index !== active} aria-label={`${index + 1} dari ${items.length}`} aria-roledescription="slide">
            <div data-story-image className={s.heroImage}>
              <StoryImage src={item.imageUrl} sizes="90vw" eager={index === active}/>
            </div>
            <div className={s.shade} />
            <div className={s.heroCopy}>
              <div data-story-copy className={s.heroMeta}><span className={s.badge}>{item.type === "event" ? "Acara" : "Berita"}</span><span>{item.category}</span><span>{item.date}</span></div>
              <h2 data-story-copy><Link href={`/aktivitas/${item.slug}`}>{item.title}</Link></h2>
              <p data-story-copy>{item.description}</p>
              <Link data-story-copy className={s.readLink} href={`/aktivitas/${item.slug}`}>{item.type === "event" ? "Jelajahi acara" : "Baca cerita"}<span><ArrowRight size={20}/></span></Link>
            </div>
          </article>
        ))}
      </div>
      <div className={s.featuredBar}>
        {multiple && <div className={s.controls}>
          <button className={s.roundButton} aria-label="Sorotan sebelumnya" onClick={() => goTo(active - 1, -1)}><ArrowLeft size={27}/></button>
          <button className={s.roundButton} aria-label="Sorotan berikutnya" onClick={() => goTo(active + 1)}><ArrowRight size={27}/></button>
        </div>}
      </div>
      <div className={s.waveBoundary} aria-hidden="true"><svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path d="M0 58C260 -18 450 6 760 58S1210 118 1440 38V100H0Z" fill="#fffcf3"/></svg></div>
      <span className={s.srOnly} aria-live={running ? "off" : "polite"}>Sorotan {active + 1} dari {items.length}: {items[active]?.title}</span>
    </section>
  );
}

