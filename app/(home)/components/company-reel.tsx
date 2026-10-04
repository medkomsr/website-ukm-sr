"use client";

import { useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./sr-home.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function CompanyReel({
  poster,
  onPlay,
}: {
  poster: string;
  onPlay: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                id: "sr-company-reel",
                trigger: root.current,
                start: "top 90px",
                end: () => `+=${innerHeight * 1.1}`,
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
                refreshPriority: 4,
              },
            })
            .fromTo(
              "[data-reel-frame]",
              { width: "44%", borderRadius: 24 },
              {
                width: "100%",
                borderRadius: 16,
                duration: 1,
                ease: "none",
              },
            )
            .to({}, { duration: 0.25 });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      id="reel"
      className={s.companyReel}
      aria-label="Company profile Seni Religi"
    >
      <button
        data-reel-frame
        className={s.videoFrame}
        onClick={onPlay}
        aria-label="Putar video company profile Seni Religi"
      >
        <Image src={poster} alt="" fill sizes="90vw" />
        <span className={s.videoKicker}>MALANG · UNIVERSITAS BRAWIJAYA</span>
        <span className={s.videoPlay}>
          PLAY <Play fill="currentColor" size={30} /> VIDEO
        </span>
        <span className={s.videoCaption}>SENI RELIGI — COMPANY PROFILE</span>
      </button>
    </section>
  );
}
