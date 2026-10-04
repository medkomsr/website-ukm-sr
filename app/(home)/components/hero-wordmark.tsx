"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowDown } from "lucide-react";
import s from "./sr-home.module.css";
import { wordmarkGlyphs } from "./sr-wordmark-paths";

gsap.registerPlugin(useGSAP, MorphSVGPlugin, ScrollTrigger, ScrollToPlugin);
const shape = (index: number, width: number) => {
  const left = 6,
    right = width - 8,
    mid = (left + right) / 2;
  return [
    `M${mid} 12 ${right} 80 ${mid} 148 ${left} 80Z`,
    `M${left} 16H${right}V144H${left}Z`,
    `M${mid} 12C${right} 12 ${right} 148 ${mid} 148C${left} 148 ${left} 12 ${mid} 12Z`,
    `M${mid} 12Q${mid} 80 ${right} 80Q${mid} 80 ${mid} 148Q${mid} 80 ${left} 80Q${mid} 80 ${mid} 12Z`,
  ][index % 4];
};
const wordWidth = (word: string) =>
  [...word].reduce((sum, letter) => sum + wordmarkGlyphs[letter].advance, 0);

export function HeroWordmark() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const paths = Array.from(
          root.current!.querySelectorAll<SVGPathElement>("[data-letter]"),
        );
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.1,
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          },
        });
        paths.forEach((path, i) =>
          gsap.set(path, {
            morphSVG: shape(i, wordmarkGlyphs[path.dataset.letter!].advance),
          }),
        );
        paths.forEach((path, i) =>
          tl.to(
            path,
            {
              morphSVG: wordmarkGlyphs[path.dataset.letter!].d,
              duration: 0.8,
              ease: "power3.inOut",
            },
            0.7 + i * 0.5,
          ),
        );
        tl.to({}, { duration: 2.5 });
        paths.forEach((path, i) =>
          tl.to(
            path,
            {
              morphSVG: shape(i, wordmarkGlyphs[path.dataset.letter!].advance),
              duration: 0.65,
              ease: "power3.inOut",
            },
            9 + i * 0.06,
          ),
        );
        gsap.from(root.current, {
          autoAlpha: 0,
          y: 32,
          duration: 1.1,
          ease: "power3.out",
        });
      });
      return () => {
        mm.revert();
      };
    },
    { scope: root },
  );
  return (
    <div className={s.wordmarkWrap}>
      <h1 id="hero-title" className={s.srOnly}>
        Seni Religi
      </h1>
      <div ref={root} className={s.wordmark} aria-hidden="true">
        {["SENI", "RELIGI"].map((word, row) => (
          <svg
            key={word}
            viewBox={`0 0 ${wordWidth(word)} 168`}
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={`sr-wordmark-metal-${row}`}
                x1="0%"
                y1="0%"
                x2="75%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--metal-shadow)" />
                <stop offset="32%" stopColor="var(--metal-base)" />
                <stop offset="48%" stopColor="var(--metal-shine)" />
                <stop offset="64%" stopColor="var(--metal-base)" />
                <stop offset="100%" stopColor="var(--metal-shadow)" />
              </linearGradient>
            </defs>
            {Array.from(word).map((letter, i) => (
              <g
                key={i}
                transform={`translate(${wordWidth(word.slice(0, i))},0)`}
              >
                <g data-letter-group>
                  <path
                    data-letter={letter}
                    d={wordmarkGlyphs[letter].d}
                    fillRule="nonzero"
                    fill={`url(#sr-wordmark-metal-${row})`}
                  />
                </g>
              </g>
            ))}
          </svg>
        ))}
      </div>
    </div>
  );
}

export function HeroScrollButton() {
  const root = useRef<HTMLAnchorElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const scrollToMotto = contextSafe(() => {
    const target = document.getElementById("process");
    if (!target) return;
    const y =
      ScrollTrigger.getById("sr-motto")?.start ??
      target.getBoundingClientRect().top + window.scrollY;
    gsap.to(window, {
      scrollTo: { y, autoKill: true },
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 1.4,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  });
  return (
    <a
      ref={root}
      href="#process"
      onClick={(event) => {
        event.preventDefault();
        scrollToMotto();
      }}
      className={s.heroScroll}
      data-magnetic
      aria-label="Gulir ke motto Seni Religi"
    >
      <span>
        Jelajahi Seni Religi
        <ArrowDown size={19} />
      </span>
    </a>
  );
}
