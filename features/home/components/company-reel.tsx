"use client";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SrSymbol } from "@/components/brand/art-symbol";
import r from "@/features/home/components/company-reel.module.scss";

import { CompanyVideo } from "./company-video";
import { CompanyVideoDialog, type VideoOrigin } from "./company-video-dialog";
import { companyVideoSource } from "../lib/company-video";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const description =
  "Seni Religi adalah ruang berkarya dan bertumbuh bersama di Universitas Brawijaya. Melalui delapan bidang, kami mempertemukan seni, ilmu, dan nilai Al-Qur’an dalam satu keluarga.";
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span className={r.word} key={index}>
          <span data-reel-word>{word}</span>{" "}
        </span>
      ))}
    </>
  );
}
export function CompanyReel({ poster, videoUrl }: { poster: string; videoUrl?: string }) {
  const root = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<VideoOrigin | null>(null);
  const [visible, setVisible] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const source = companyVideoSource(videoUrl);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setPreviewLoaded(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(frameRef.current!);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
    };
  }, []);
  const openVideo = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = frameRef.current!.getBoundingClientRect();
    setOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      trigger: event.currentTarget,
    });
  };
  const warpId = `reel-warp-${useId().replace(/:/g, "")}`;
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const element = root.current!;
        gsap.from(element.querySelectorAll("h2 [data-reel-word]"), {
          x: 100,
          yPercent: 110,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(element.querySelectorAll("[data-reel-copy] [data-reel-word]"), {
          x: 28,
          y: 14,
          opacity: 0,
          stagger: 0.015,
          duration: 0.7,
          scrollTrigger: {
            trigger: "[data-reel-copy]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        const ribbon = element.querySelector("[data-reel-line]");
        // Finish the loop before the thumbnail expands; pin spacing must not stretch this draw.
        gsap.fromTo(
          ribbon,
          { attr: { "stroke-dashoffset": 1 } },
          {
            attr: { "stroke-dashoffset": 0 },
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              endTrigger: element.querySelector("[data-reel-intro]"),
              end: "bottom 46%",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.fromTo(
          ribbon,
          {
            attr: {
              d: "M1530 90C1340 140 1210 220 1210 390C1210 570 1320 730 1110 775C910 820 850 615 1040 595C1280 570 1210 805 845 760C570 710 460 860 240 770C120 710 40 770 -90 845",
            },
          },
          {
            attr: {
              d: "M1530 90C1340 140 1250 235 1240 410C1230 600 1300 760 1090 785C870 810 855 580 1050 605C1300 635 1170 820 835 755C575 705 460 815 245 765C105 730 30 815 -90 845",
            },
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: element,
              start: "top 55%",
              endTrigger: element.querySelector("[data-reel-intro]"),
              end: "bottom 10%",
              scrub: 1.2,
            },
          },
        );
      });
      mm.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.current!.querySelector<HTMLElement>("[data-reel-stage]")!;
        const frame = root.current!.querySelector<HTMLElement>("[data-reel-frame]")!;
        // The right edge stays anchored while both dimensions grow from a thumbnail.
        const expand = gsap.timeline({
          scrollTrigger: {
            id: "sr-reel",
            trigger: stage,
            start: "top 42%",
            end: () => `+=${innerHeight * 1.55}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 3,
          },
        });
        expand
          .fromTo(
            "[data-reel-curve]",
            { attr: { d: "M0 0 C.33 0 .66 0 1 0 L1 1 C.66 1 .33 1 0 1 Z" } },
            {
              attr: {
                d: "M0 .04 C.3 .18 .6 0 1 .1 L1 .98 C.7 .82 .3 1 0 .9 Z",
              },
              duration: 0.4,
              ease: "sine.inOut",
            },
            0.05,
          )
          .to(
            "[data-reel-curve]",
            {
              attr: { d: "M0 0 C.33 0 .66 0 1 0 L1 1 C.66 1 .33 1 0 1 Z" },
              duration: 0.55,
              ease: "sine.out",
            },
            0.45,
          )
          .fromTo(
            frame,
            { width: "44%", y: 0 },
            {
              width: "100%",
              y: () => -innerHeight * 0.27,
              duration: 1,
              ease: "sine.inOut",
            },
            0,
          )
          .to(
            frame,
            {
              rotationY: -18,
              rotationZ: -3,
              skewY: 4,
              duration: 0.35,
              ease: "sine.inOut",
            },
            0.05,
          )
          .to(
            frame,
            {
              rotationY: 7,
              rotationZ: 2,
              skewY: -3,
              duration: 0.3,
              ease: "sine.inOut",
            },
            0.4,
          )
          .to(
            frame,
            {
              rotationY: 0,
              rotationZ: 0,
              skewY: 0,
              duration: 0.3,
              ease: "sine.out",
            },
            0.7,
          )
          .to("[data-reel-warp]", { attr: { scale: 42 }, duration: 0.35, ease: "sine.inOut" }, 0.05)
          .to("[data-reel-warp]", { attr: { scale: 0 }, duration: 0.6, ease: "sine.out" }, 0.4)
          .to("[data-reel-tint]", { opacity: 0, duration: 0.7 }, 0.2)
          .fromTo(
            "[data-reel-play]",
            { autoAlpha: 0, y: 30, scale: 0.85 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.2 },
            0.85,
          )
          .from("[data-reel-marks]", { opacity: 0, y: 18, duration: 0.2 }, 0.85)
          .to({}, { duration: 0.15 });
      });
      mm.add("(max-width: 800px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-reel-frame]",
          { width: "72%" },
          {
            width: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-reel-stage]",
              start: "top 90%",
              end: "top 35%",
              scrub: 0.4,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      id="reel"
      data-tone="cream"
      data-wave
      className={r.section}
      aria-label="Company profile Seni Religi"
    >
      <svg width="0" height="0" aria-hidden="true" className={r.filterDefs}>
        <defs>
          <clipPath id={`${warpId}-clip`} clipPathUnits="objectBoundingBox">
            <path data-reel-curve d="M0 0 C.33 0 .66 0 1 0 L1 1 C.66 1 .33 1 0 1 Z" />
          </clipPath>
          <filter
            id={warpId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.006"
              numOctaves="1"
              seed="4"
              result="wave"
            />
            <feDisplacementMap
              data-reel-warp
              in="SourceGraphic"
              in2="wave"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className={r.ribbon}
        viewBox="0 0 1440 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          data-reel-line
          d="M1530 90C1340 140 1210 220 1210 390C1210 570 1320 730 1110 775C910 820 850 615 1040 595C1280 570 1210 805 845 760C570 710 460 860 240 770C120 710 40 770 -90 845"
          fill="none"
          stroke="currentColor"
          strokeWidth="32"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
        />
      </svg>
      <div data-reel-intro className={r.intro}>
        <p className={r.label}>KENALI SENI RELIGI</p>
        <h2 className={r.heading}>
          <span className={r.titleLine}>
            <Words text="Berangkat dari hati." />
          </span>
          <span className={r.titleLine}>
            <Words text="Tumbuh lewat karya." />
          </span>
        </h2>
        <div data-reel-copy className={r.copy}>
          <p>
            <Words text={description} />
          </p>
          <Link href="/tentang">
            Kenali kami lebih dekat <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div data-reel-stage className={r.stage}>
        <div
          ref={frameRef}
          data-reel-frame
          style={{ clipPath: `url(#${warpId}-clip)` }}
          className={r.frame}
        >
          <div className={r.media} style={{ filter: `url(#${warpId})` }}>
            <Image src={poster} alt="" fill sizes="90vw" />
            {source && previewLoaded && !reduced && (
              <CompanyVideo
                key={videoUrl}
                url={videoUrl!}
                preview
                active={visible && !origin && !paused}
              />
            )}
          </div>
          <span data-reel-tint className={r.tint} aria-hidden="true" />
          <button
            className={r.playSurface}
            onClick={openVideo}
            disabled={!source}
            aria-label="Putar video company profile Seni Religi"
          >
            <span className={r.playPosition}>
              <span data-reel-play className={r.play}>
                <span>PUTAR</span>
                <span className={r.playIcon}>
                  <Play size={24} fill="currentColor" />
                </span>
                <span>VIDEO</span>
              </span>
            </span>
          </button>
          {source && !reduced && (
            <button
              className={r.previewToggle}
              aria-label={paused ? "Putar preview video" : "Jeda preview video"}
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
              <span>PREVIEW</span>
            </button>
          )}
          <span className={r.caption}>SENI RELIGI · UNIVERSITAS BRAWIJAYA</span>
        </div>
        <div data-reel-marks className={r.marks} aria-hidden="true">
          {[0, 2, 4, 5, 6].map((index) => (
            <SrSymbol key={index} index={index} />
          ))}
        </div>
      </div>
      {origin && source && videoUrl && (
        <CompanyVideoDialog url={videoUrl} origin={origin} close={() => setOrigin(null)} />
      )}
    </section>
  );
}
