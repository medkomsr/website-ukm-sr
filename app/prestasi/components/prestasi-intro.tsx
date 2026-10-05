"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SrSymbol } from "@/app/(home)/components/sr-symbol";
import s from "./achievements.module.css";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function PrestasiIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const line = root.current!.querySelector<HTMLElement>("[data-intro-line]")!;
      const split = new SplitText(line, {
        type: "chars", charsClass: s.introChar, aria: "none",
      });
      gsap.set(line, { perspective: 700, transformStyle: "preserve-3d" });

      // Rotate into the front-facing position once, then leave the title at rest.
      gsap.fromTo(split.chars, { rotationX: -90, opacity: 0 }, {
        rotationX: 0, opacity: 1, stagger: .08, duration: 1.1, ease: "power3.out",
        transformOrigin: () => `50% 50% ${-window.innerWidth / 8}px`,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });

      // Animate the SVG layer so the outer icon can keep its scroll parallax.
      gsap.from("[data-transition-symbol] > svg", {
        autoAlpha: 0, y: 28, scale: .72, rotation: -12,
        transformOrigin: "50% 50%", duration: 1.1, stagger: .12,
        delay: .2, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });

      gsap.to("[data-prestasi-title-mask]", {
        yPercent: -30, opacity: .15, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 25%", scrub: .8 },
      });

      return () => split.revert();
    });
    return () => media.revert();
  }, { scope: root });

  return <section ref={root} className={s.prestasiIntro} data-prestasi-intro data-tone="green" aria-labelledby="prestasi-title">
    <div className={`${s.transitionSymbols} ${s.introSymbols}`} data-transition-symbols aria-hidden="true">
      {[1, 3, 6, 7].map(index => <span key={index} className={s.transitionSymbol} data-transition-symbol><SrSymbol index={index}/></span>)}
    </div>
    <div className={s.introTitleMask} data-prestasi-title-mask>
      <h1 id="prestasi-title" className={s.introTube} aria-label="PRESTASI">
        <span className={s.introLine} data-intro-line aria-hidden="true">PRESTASI</span>
      </h1>
    </div>
  </section>;
}
