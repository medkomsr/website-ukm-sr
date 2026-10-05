"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PointerEvent, RefObject } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function useContactMotion(root: RefObject<HTMLElement | null>) {
  const { contextSafe } = useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-contact-title]", {
          yPercent: 110,
          rotation: 3,
          duration: 1.15,
          ease: "power3.out",
        });
        gsap.utils.toArray<HTMLElement>("[data-contact-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 32,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  const moveButton = contextSafe((event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches)
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(event.currentTarget, {
      x: (event.clientX - rect.left - rect.width / 2) * 0.15,
      y: (event.clientY - rect.top - rect.height / 2) * 0.25,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  });
  const resetButton = contextSafe((event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1,.45)",
      overwrite: "auto",
    });
  });

  return { moveButton, resetButton };
}
