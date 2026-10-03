"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin,
);

/** Keep the fixed navigation outside the transformed ScrollSmoother content. */
export default function GsapStage({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    (context, contextSafe) => {
      if (pathname !== "/" || !content.current || !wrapper.current) return;
      const media = gsap.matchMedia();
      let disposed = false;
      let refreshTimer: ReturnType<typeof setTimeout>;
      const start = contextSafe!(() => {
        if (disposed) return;
        media.add(
          {
            desktop: "(min-width: 901px) and (pointer: fine)",
            wide: "(min-width: 701px)",
            motion: "(prefers-reduced-motion: no-preference)",
          },
          (match) => {
            if (!match.conditions?.motion) return;
            const root = content.current!;
            const select = gsap.utils.selector(root);
            const smoother = match.conditions.desktop
              ? ScrollSmoother.create({
                  wrapper: wrapper.current!,
                  content: root,
                  smooth: 1.15,
                  smoothTouch: false,
                  effects: false,
                  onFocusIn: (_self, event) =>
                    root.contains(event.target as Node),
                })
              : null;

            // Create the pin only after ScrollSmoother establishes its coordinate system.
            const reel = root.querySelector<HTMLElement>("[data-reel-pin]");
            const video = root.querySelector<HTMLElement>("[data-video-frame]");
            if (reel && video && match.conditions.wide) {
              const reelTimeline = gsap.timeline({
                scrollTrigger: {
                  id: "sr-company-reel",
                  trigger: reel,
                  start: () => `top ${window.innerWidth <= 700 ? 76 : 80}px`,
                  end: () => `+=${Math.max(500, window.innerHeight * 1.2)}`,
                  pin: true,
                  pinSpacing: true,
                  scrub: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              reelTimeline.fromTo(
                video,
                { width: "44%", xPercent: -58 },
                { width: "100%", xPercent: 0, duration: 0.7, ease: "none" },
              );
              // Hold the fully expanded, centered frame before releasing the pin.
              reelTimeline.to({}, { duration: 0.3 });
            } else if (video) {
              // Mobile keeps the video in document flow without a tall pin spacer.
              gsap.from(video, {
                y: 18,
                autoAlpha: 0,
                duration: 0.65,
                ease: "power2.out",
                scrollTrigger: { trigger: video, start: "top 94%", once: true },
              });
            }

            // Splitting only text spans leaves the decorative SVG and semantic h1 intact.
            const heroText = SplitText.create(select("[data-hero-line]"), {
              type: "words,chars",
              charsClass: "hero-char",
              aria: "auto",
            });
            const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
            intro
              .from(select("[data-hero-label]"), {
                y: 16,
                autoAlpha: 0,
                duration: 0.55,
              })
              .from(
                heroText.chars,
                {
                  yPercent: 115,
                  rotate: 6,
                  autoAlpha: 0,
                  stagger: 0.023,
                  duration: 0.85,
                },
                0.12,
              );
            if (select("[data-hero-art]").length)
              intro.from(
                select("[data-hero-art]"),
                { y: 45, autoAlpha: 0, duration: 1.1 },
                0.2,
              );
            intro
              .from(
                select("[data-arch-line]"),
                {
                  drawSVG: "0%",
                  stagger: 0.1,
                  duration: 1.9,
                  ease: "power2.inOut",
                },
                0.55,
              )
              .from(
                select("[data-hero-detail]"),
                { y: 20, autoAlpha: 0, stagger: 0.12, duration: 0.7 },
                0.65,
              );

            select("h2[data-split]").forEach((heading: HTMLElement) => {
              SplitText.create(heading, {
                type: "lines,words",
                mask: "lines",
                autoSplit: true,
                aria: "auto",
                onSplit(self) {
                  return gsap.from(self.words, {
                    yPercent: 110,
                    rotate: 3,
                    autoAlpha: 0,
                    stagger: 0.045,
                    duration: 0.85,
                    ease: "power3.out",
                    scrollTrigger: {
                      trigger: heading,
                      start: "top 89%",
                      once: true,
                    },
                  });
                },
              });
            });

            select("[data-reveal]").forEach((element: HTMLElement) => {
              gsap.from(element, {
                y: 50,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 92%",
                  once: true,
                },
              });
            });
            select("[data-scroll-rosette]").forEach((element) => {
              gsap.to(element, {
                rotation: 180,
                transformOrigin: "50% 50%",
                ease: "none",
                scrollTrigger: {
                  trigger: element,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              });
            });
            const progress = document.querySelector("[data-scroll-progress]");
            if (progress)
              gsap.fromTo(
                progress,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  ease: "none",
                  scrollTrigger: { start: 0, end: "max", scrub: true },
                },
              );

            const art = root.querySelector("[data-hero-art]");
            if (art && match.conditions.desktop) {
              gsap.to(art, {
                y: 95,
                rotation: 2,
                ease: "none",
                scrollTrigger: {
                  trigger: "[data-sr-hero]",
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
            }
            const orbit = root.querySelector("[data-orbit-dot]");
            const orbitPath = root.querySelector("[data-orbit-path]");
            if (orbit && orbitPath)
              gsap.to(orbit, {
                motionPath: {
                  path: orbitPath as SVGPathElement,
                  align: orbitPath as SVGPathElement,
                  alignOrigin: [0.5, 0.5],
                },
                duration: 14,
                repeat: -1,
                ease: "none",
              });

            // Stop ambient motion while the hero is off screen.
            if (orbit)
              ScrollTrigger.create({
                trigger: "[data-sr-hero]",
                start: "top bottom",
                end: "bottom top",
                onToggle: (self) => {
                  gsap
                    .getTweensOf(orbit)
                    .forEach((tween) => tween.paused(!self.isActive));
                },
              });

            const click = (event: MouseEvent) => {
              const link = (event.target as Element).closest<HTMLAnchorElement>(
                'a[href^="#"]',
              );
              if (
                !link ||
                !smoother ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              )
                return;
              const target = document.getElementById(link.hash.slice(1));
              if (!target) return;
              event.preventDefault();
              history.pushState(null, "", link.hash);
              smoother.scrollTo(target, true, "top 100px");
              target.setAttribute("tabindex", "-1");
              target.focus({ preventScroll: true });
            };
            root.addEventListener("click", click);
            ScrollTrigger.refresh();
            return () => {
              root.removeEventListener("click", click);
              smoother?.kill();
            };
          },
        );
      });
      // Fonts must settle before SplitText calculates masks and line breaks.
      document.fonts.ready.then(start);
      let height = content.current.offsetHeight;
      const observer = new ResizeObserver(() => {
        const next = content.current?.offsetHeight ?? 0;
        if (next === height) return;
        height = next;
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
      });
      observer.observe(content.current);
      return () => {
        disposed = true;
        clearTimeout(refreshTimer);
        observer.disconnect();
        media.revert();
      };
    },
    { scope: content, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={wrapper}>
      <div
        ref={content}
        className={
          compact
            ? "pt-[64px] max-[700px]:pt-[60px]"
            : "pt-[88px] max-[900px]:pt-[76px]"
        }
      >
        {children}
      </div>
    </div>
  );
}
