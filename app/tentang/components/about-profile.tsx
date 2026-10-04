"use client";

import { useRef, type CSSProperties, type MouseEvent } from "react";
import { ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useVisiMisi } from "@/hooks/useVisiMisi";
import { SrSymbol } from "@/app/(home)/components/sr-symbol";
import s from "./about-profile.module.css";
import Cabinet from "./cabinet";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

const fallbackVision = "Menjadi ruang untuk mengembangkan potensi, mempertemukan kreativitas dengan nilai religi, dan menghadirkan karya yang membawa kebaikan.";
const fallbackMissions = ["Melalui pembinaan bidang dan kegiatan bersama, kami merawat proses belajar, membangun kebersamaan, dan memberi ruang bagi karya mahasiswa."];

function PurposePanel({ kind, texts }: { kind: "visi" | "misi"; texts: string[] }) {
  const panel = useRef<HTMLElement>(null);

  useGSAP(() => {
    let disposed = false;
    const media = gsap.matchMedia();

    // Fonts must settle before measuring lines. autoSplit handles later resizes.
    document.fonts.ready.then(() => {
      if (disposed || !panel.current) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const blocks = panel.current!.querySelectorAll<HTMLElement>("[data-purpose-text]");
        const splits = Array.from(blocks, (text) => SplitText.create(text, {
          type: "words,lines",
          mask: "lines",
          linesClass: s.line,
          autoSplit: true,
          onSplit: (instance) => gsap.from(instance.lines, {
            yPercent: 120,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: text,
              scrub: 0.6,
              // Finish while the text is still comfortably within the viewport.
              start: "clamp(top 90%)",
              end: "clamp(bottom 65%)",
            },
          }),
        }));
        return () => splits.forEach((split) => split.revert());
      });
      ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      media.revert();
    };
  }, { scope: panel });

  return (
    <section ref={panel} id={kind === "visi" ? "cerita-sr" : "misi-sr"}
      data-tone={kind === "visi" ? "green" : "cream"} data-wave
      className={s.purpose} aria-labelledby={`${kind}-title`} tabIndex={-1}>
      <div className={s.purposeCopy}>
        <h2 data-purpose-text id={`${kind}-title`} className={s.purposeLabel}>{kind === "visi" ? "VISI" : "MISI"}</h2>
        {kind === "visi" ? <p data-purpose-text className={s.purposeText}>{texts[0]}</p> : (
          <ol className={s.missions}>
            {texts.map((text, index) => <li key={index}>
              <span data-purpose-text className={s.missionNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <p data-purpose-text className={s.purposeText}>{text}</p>
            </li>)}
          </ol>
        )}
      </div>
    </section>
  );
}

export default function AboutProfile() {
  const root = useRef<HTMLDivElement>(null);
  const { data: purpose } = useVisiMisi();
  const vision = purpose?.visi || fallbackVision;
  const missions = purpose?.misi?.length ? purpose.misi : fallbackMissions;

  const { contextSafe } = useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-about-intro]", { x: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" });
    });
    return () => media.revert();
  }, { scope: root });

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
            <span key={index} className={s.ornament} style={{ "--i": position } as CSSProperties}><SrSymbol index={index} /></span>
          ))}
        </div>
        <div className={s.heroCopy}>
          <p data-about-intro className={s.label}>TENTANG SENI RELIGI</p>
          <h1 data-about-intro id="about-title">Seni. Religi.</h1>
          <p data-about-intro className={s.lead}>Kami adalah keluarga Seni Religi di Universitas Brawijaya. Tempat bertemunya seni, ilmu, dan nilai Al-Qur’an — untuk belajar, berkarya, dan tumbuh bersama.</p>
          <a data-about-intro className={s.scrollLink} href="#cerita-sr" onClick={scrollToVision}>Kenali kami lebih dekat <ArrowDown size={18} /></a>
        </div>
      </section>
      {/* Remount on CMS changes so React never reconciles text modified by SplitText. */}
      <PurposePanel key={vision} kind="visi" texts={[vision]} />
      <PurposePanel key={JSON.stringify(missions)} kind="misi" texts={missions} />
      <Cabinet />
    </div>
  );
}
