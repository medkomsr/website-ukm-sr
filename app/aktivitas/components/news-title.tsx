"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./newsroom.module.css";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function NewsTitle() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    let disposed = false;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const restartOnReload = navigation?.type === "reload" && !location.hash;
    const previousRestoration = history.scrollRestoration;
    if (restartOnReload) {
      history.scrollRestoration = "manual";
      ScrollTrigger.clearScrollMemory("manual");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    document.fonts.ready.then(() => {
      if (disposed) return;
      if (restartOnReload) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(title.current!, { type: "chars,words", charsClass: "news-title-char", aria: "auto" });
        // Hover uses an inner layer so it never overwrites scroll rotation/position.
        const glyphs = split.chars.map(char => {
          const glyph = document.createElement("span");
          glyph.className = "news-title-glyph";
          glyph.style.display = "inline-block";
          glyph.append(...char.childNodes);
          char.append(glyph);
          return glyph;
        });
        gsap.set(split.chars, { autoAlpha: 0, scale: .45, transformOrigin: "50% 100%" });
        // Scroll controls the scattered layout; entry controls visibility and scale independently.
        const scrollTimeline = gsap.timeline({ scrollTrigger: {
          trigger: root.current, start: "clamp(top 100px)",
          end: () => `+=${Math.min(600, Math.max(260, innerWidth * .42))}`,
          pin: true, scrub: .6, invalidateOnRefresh: true,
        } });
        scrollTimeline.fromTo(title.current, { xPercent: 15 }, { xPercent: 0, ease: "none", duration: 1 }, 0)
          .fromTo(split.chars, {
            yPercent: (i) => i % 2 ? 85 : -85,
            rotation: (i) => i % 2 ? 18 : -18,
          }, { yPercent: 0, rotation: 0, duration: .55, stagger: .035, ease: "back.out(1.2)" }, 0)
          .to({}, { duration: .18 });
        gsap.set(title.current, { visibility: "visible" });
        gsap.to(split.chars, {
          autoAlpha: 1, scale: 1,
          duration: .6, stagger: { amount: .9 }, ease: "back.out(1.7)",
        });
        const onOver = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const glyph = (event.target as HTMLElement).closest(".news-title-glyph");
          if (!glyph) return;
          gsap.to(glyph, { y: -12, rotation: -7, color: "#82916b", duration: .22, overwrite: "auto" });
        };
        const onOut = (event: PointerEvent) => {
          const glyph = (event.target as HTMLElement).closest(".news-title-glyph");
          if (!glyph) return;
          gsap.to(glyph, { y: 0, rotation: 0, color: "", duration: .6, ease: "elastic.out(1,.4)", overwrite: "auto" });
        };
        const heading = title.current!;
        heading.addEventListener("pointerover", onOver);
        heading.addEventListener("pointerout", onOut);
        ScrollTrigger.refresh();
        return () => { heading.removeEventListener("pointerover", onOver); heading.removeEventListener("pointerout", onOut); gsap.killTweensOf([...split.chars, ...glyphs]); split.revert(); };
      });
    });
    return () => {
      disposed = true; media.revert();
      if (restartOnReload) history.scrollRestoration = previousRestoration;
    };
  }, { scope: root });
  return <header ref={root} className={s.intro}><h1 ref={title}>Berita <em>&amp;</em> Acara<span className={s.titleDot}>.</span></h1></header>;
}
