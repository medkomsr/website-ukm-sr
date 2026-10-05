"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowDown } from "lucide-react";
import { SrSymbol } from "@/components/brand/art-symbol";
import s from "@/styles/experience.module.scss";
import h from "@/features/home/components/hero-scene.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

function HeroWord({ word }: { word: string }) {
  return (
    <span className={h.word} data-hero-word>
      {word}
    </span>
  );
}

export function HeroWordmark() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = root.current!;
        const intro = gsap.timeline();
        intro.from(
          scope.querySelectorAll("[data-hero-word]"),
          {
            y: 35,
            x: 65,
            opacity: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power3.out",
          },
          0.3,
        );
        intro.from(
          scope.querySelectorAll("[data-hero-shape]"),
          {
            x: () => Math.min(innerWidth * 0.3, 360),
            rotation: 35,
            scale: 0.35,
            opacity: 0,
            duration: 1.3,
            stagger: 0.1,
            ease: "back.out(1.3)",
          },
          0,
        );
        intro.from(
          scope.querySelector("[data-hero-university]"),
          {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          0.65,
        );
        intro.from(
          scope.querySelector("[data-hero-line]"),
          {
            strokeDashoffset: 1,
            autoRound: false,
            duration: 1.5,
            ease: "power2.inOut",
          },
          0.8,
        );
        gsap.to(scope.querySelectorAll("[data-hero-float]"), {
          y: (i) => (i % 2 ? 12 : -12),
          rotation: (i) => (i % 2 ? 8 : -8),
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={h.scene}>
      <h1 id="hero-title" className={s.srOnly}>
        Seni Religi — Universitas Brawijaya
      </h1>
      <div className={h.composition} aria-hidden="true">
        <div className={h.rowOne}>
          <div className={h.emblems}>
            {[0, 5, 2, 6].map((index) => (
              <span data-hero-shape className={h.emblem} key={index}>
                <span data-hero-float>
                  <SrSymbol index={index} />
                </span>
              </span>
            ))}
          </div>
          <HeroWord word="Seni" />
        </div>
        <div className={h.rowTwo}>
          <div className={h.religiGroup}>
            <HeroWord word="Religi" />
            <span data-hero-shape className={h.ktdaqLogo}>
              <SrSymbol index={4} />
            </span>
            <span data-hero-shape className={h.logoWrap}>
              <Image className={h.srLogo} src="/logo.png" alt="" width={100} height={100} />
            </span>
          </div>
          <svg className={h.arrow} preserveAspectRatio="none" viewBox="0 0 440 170" fill="none">
            <path
              data-hero-line
              d="M290 22V55Q290 130 215 130H12m18-18-18 18 18 18"
              pathLength="1"
              strokeDasharray="1"
              stroke="currentColor"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div data-hero-university className={h.university}>
          <span>Universitas Brawijaya</span>
        </div>
      </div>
      <span className={h.dotOne} aria-hidden="true" />
      <span className={h.dotTwo} aria-hidden="true" />
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
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1.4,
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
