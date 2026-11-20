"use client";

import { TextSkeleton } from "@/components/content/content-skeleton";

import { useRef, type CSSProperties, type MouseEvent } from "react";
import { ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useVisiMisi } from "@/hooks/content/use-visi-misi";
import { SrSymbol } from "@/components/brand/art-symbol";
import s from "@/features/about/components/about-profile.module.scss";
import Cabinet from "@/features/about/components/cabinet";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

function PurposePanel({
  kind,
  texts,
  pending = false,
}: {
  kind: "visi" | "misi";
  texts: string[];
  pending?: boolean;
}) {
  const panel = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Animate the intact text so CMS updates and wrapping never leave clipped lines.
        panel.current!.querySelectorAll<HTMLElement>("[data-purpose-text]").forEach((text) => {
          gsap.from(text, {
            y: 24,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: text, start: "top 93%", once: true },
          });
        });
      });
      ScrollTrigger.refresh();
      return () => media.revert();
    },
    { scope: panel },
  );

  return (
    <section
      ref={panel}
      id={kind === "visi" ? "cerita-sr" : "misi-sr"}
      data-tone={kind === "visi" ? "green" : "cream"}
      data-wave
      className={s.purpose}
      aria-labelledby={`${kind}-title`}
      tabIndex={-1}
    >
      <div className={s.purposeCopy}>
        <h2 data-purpose-text id={`${kind}-title`} className={s.purposeLabel}>
          {kind === "visi" ? "VISI" : "MISI"}
        </h2>
        {kind === "visi" ? (
          <p data-purpose-text className={s.purposeText}>
            {pending ? <TextSkeleton /> : texts[0]}
          </p>
        ) : (
          <ol className={s.missions}>
            {(pending ? [""] : texts).map((text, index) => (
              <li key={index}>
                <span data-purpose-text className={s.missionNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p data-purpose-text className={s.purposeText}>
                  {pending ? <TextSkeleton /> : text}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

export default function AboutProfile() {
  const root = useRef<HTMLDivElement>(null);
  const { data: purpose, isPending, isError } = useVisiMisi();
  const vision = isPending
    ? ""
    : purpose?.visi || (isError ? "Visi belum dapat dimuat." : "Visi belum dipublikasikan.");
  const missions = isPending
    ? []
    : purpose?.misi?.length
      ? purpose.misi
      : [isError ? "Misi belum dapat dimuat." : "Misi belum dipublikasikan."];

  const { contextSafe } = useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-about-intro]", {
          x: 48,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  const scrollToVision = contextSafe((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById("cerita-sr");
    if (!target) return;
    event.preventDefault();
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1.4,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: () => {
        window.history.replaceState(null, "", "#cerita-sr");
        target.focus({ preventScroll: true });
      },
    });
  });

  return (
    <div ref={root} className={s.page}>
      <section data-tone="cream" className={s.hero} aria-labelledby="about-title">
        <div className={s.ornaments} aria-hidden="true">
          {[0, 5, 6, 2, 4, 1].map((index, position) => (
            <span key={index} className={s.ornament} style={{ "--i": position } as CSSProperties}>
              <SrSymbol index={index} />
            </span>
          ))}
        </div>
        <div className={s.heroCopy}>
          <p data-about-intro className={s.label}>
            TENTANG SENI RELIGI
          </p>
          <h1 data-about-intro id="about-title">
            Seni. Religi.
          </h1>
          <p data-about-intro className={s.lead}>
            Kami adalah keluarga Seni Religi di Universitas Brawijaya. Tempat bertemunya seni, ilmu,
            dan nilai Al-Qur’an — untuk belajar, berkarya, dan tumbuh bersama.
          </p>
          <a data-about-intro className={s.scrollLink} href="#cerita-sr" onClick={scrollToVision}>
            Kenali kami lebih dekat <ArrowDown size={18} />
          </a>
        </div>
      </section>
      {/* Restart the entrance when the published CMS content changes. */}
      <PurposePanel key={vision} kind="visi" pending={isPending} texts={[vision]} />
      <PurposePanel
        key={JSON.stringify(missions)}
        kind="misi"
        pending={isPending}
        texts={missions}
      />
      <Cabinet />
    </div>
  );
}
