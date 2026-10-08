"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import s from "@/styles/experience.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** Scoped effects: separate targets keep entrance, hover, flip and scroll transforms independent. */
export function useHomeMotion(root: RefObject<HTMLDivElement | null>, contentCount: number) {
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = root.current!;
        const cleanups: (() => void)[] = [];
        const listen = (el: Element, name: string, fn: (event: Event) => void) => {
          const safe = contextSafe!(fn);
          el.addEventListener(name, safe);
          cleanups.push(() => el.removeEventListener(name, safe));
        };
        scope.querySelectorAll(`.${s.sectionTitle} h2`).forEach((heading) => {
          const split = SplitText.create(heading, {
            type: "words,chars",
            aria: "auto",
            reduceWhiteSpace: false,
          });
          gsap.from(split.chars, {
            opacity: 0,
            yPercent: 70,
            rotationX: -45,
            stagger: 0.018,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 93%", once: true },
          });
          listen(heading, "pointerenter", () => {
            gsap.to(split.chars, {
              keyframes: [
                { y: -5, duration: 0.16 },
                { y: 0, duration: 0.45 },
              ],
              stagger: 0.018,
              overwrite: true,
              ease: "power2.out",
            });
          });
        });
        scope.querySelectorAll(`.${s.partnerGrid}`).forEach((stage) => {
          gsap.from(stage.children, {
            y: 55,
            opacity: 0,
            stagger: 0.075,
            duration: 0.9,
            ease: "back.out(1.3)",
            scrollTrigger: { trigger: stage, start: "top 88%", once: true },
          });
        });
        scope.querySelectorAll(`.${s.newsImage}`).forEach((card) => {
          const img = card.querySelector("img, svg"),
            arrow = card.querySelector(`.${s.imageArrow}`);
          listen(card, "pointerenter", () => {
            gsap.to(img, {
              scale: 1.1,
              duration: 0.7,
              ease: "power3.out",
              overwrite: true,
            });
            gsap.to(arrow, {
              rotate: 45,
              scale: 1.15,
              duration: 0.45,
              ease: "back.out(2)",
              overwrite: true,
            });
          });
          listen(card, "pointermove", (event) => {
            const e = event as PointerEvent;
            if (e.pointerType !== "mouse") return;
            const r = card.getBoundingClientRect();
            gsap.to(img, {
              x: ((e.clientX - r.left) / r.width - 0.5) * 18,
              y: ((e.clientY - r.top) / r.height - 0.5) * 18,
              duration: 0.5,
              overwrite: "auto",
            });
          });
          listen(card, "pointerleave", () => {
            gsap.to(img, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.7,
              overwrite: true,
            });
            gsap.to(arrow, {
              rotate: 0,
              scale: 1,
              duration: 0.5,
              overwrite: true,
            });
          });
          listen(card, "pointerdown", () =>
            gsap.to(card, { scale: 0.975, duration: 0.15, overwrite: true }),
          );
          const release = () =>
            gsap.to(card, {
              scale: 1,
              duration: 0.5,
              ease: "back.out(2)",
              overwrite: true,
            });
          listen(card, "pointerup", release);
          listen(card, "pointerleave", release);
        });
        scope
          .querySelectorAll(`[data-magnetic], .${s.pillCta}, .${s.carouselControls} button`)
          .forEach((button) => {
            listen(button, "pointermove", (event) => {
              const e = event as PointerEvent;
              if (e.pointerType !== "mouse") return;
              const r = button.getBoundingClientRect();
              gsap.to(button, {
                x: (e.clientX - r.left - r.width / 2) * 0.15,
                y: (e.clientY - r.top - r.height / 2) * 0.25,
                duration: 0.4,
                ease: "power3.out",
                overwrite: true,
              });
            });
            listen(button, "pointerleave", () =>
              gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1,.45)",
                overwrite: true,
              }),
            );
          });
        scope.querySelectorAll(`.${s.awardStage}`).forEach((stage) => {
          gsap.to(stage, {
            y: -14,
            duration: 2.6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            scrollTrigger: {
              trigger: stage,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          });
        });
        scope.querySelectorAll(`.${s.awardCard}`).forEach((card) => {
          const symbol = card.querySelector("svg");
          if (!symbol) return;
          listen(card, "pointerenter", () =>
            gsap.to(symbol, {
              rotation: 90,
              scale: 1.18,
              duration: 0.7,
              ease: "back.out(2)",
              overwrite: true,
            }),
          );
          listen(card, "pointerleave", () =>
            gsap.to(symbol, {
              rotation: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1,.5)",
              overwrite: true,
            }),
          );
        });
        scope.querySelectorAll("[data-award-action]").forEach((button) => {
          listen(button, "click", () => {
            gsap.fromTo(
              button.querySelector("svg"),
              { rotation: 0, scale: 0.8 },
              {
                rotation: 360,
                scale: 1,
                duration: 1.2,
                ease: "elastic.out(1,.65)",
                overwrite: true,
              },
            );
            gsap.fromTo(
              scope.querySelectorAll(`.${s.awardGhost}`),
              { y: 0 },
              {
                keyframes: [
                  { y: -25, duration: 0.25 },
                  { y: 0, duration: 0.8 },
                ],
                stagger: 0.08,
                overwrite: true,
              },
            );
          });
        });
        const contact = scope.querySelector(`.${s.contact}`);
        if (contact) {
          const heading = contact.querySelector("h2"),
            symbol = contact.querySelector("[data-contact-play] img");
          gsap.from(heading, {
            y: 70,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: contact, start: "top 80%", once: true },
          });
          const burst = contact.querySelector("[data-contact-play]");
          let spin: gsap.core.Tween | undefined;
          if (burst)
            listen(burst, "click", () => {
              if (spin?.isActive()) return;
              spin = gsap.fromTo(
                symbol,
                { rotationY: 0, transformPerspective: 850 },
                {
                  rotationY: 1080,
                  duration: 3,
                  ease: "power2.inOut",
                  overwrite: "auto",
                },
              );
            });
        }
        return () => cleanups.forEach((cleanup) => cleanup());
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [contentCount], revertOnUpdate: true },
  );
}
