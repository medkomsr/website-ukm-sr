"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import m from "@/features/home/components/motto.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
const phrases = [
  ["Hidup itu", "Seni."],
  ["Seni itu", "Indah."],
  ["Indah itu", "Baik."],
  ["Yang Baik", "disenangi."],
] as const;

function Flair({ index }: { index: number }) {
  if (index === 2)
    return (
      <svg className={m.curve} viewBox="0 0 240 200" fill="none" aria-hidden="true">
        <path
          data-curve
          d="M12 182C125 182 110 18 228 18"
          stroke="currentColor"
          strokeWidth="5"
          pathLength="1"
          strokeDasharray="1"
        />
        <path
          d="M12 18v164h216"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 8"
          opacity=".35"
        />
        <circle
          data-control
          cx="12"
          cy="182"
          r="10"
          fill="var(--sr-yellow)"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  return (
    <span
      className={`${m.flair} ${[m.flower, m.orbit, m.diamond, m.asterisk][index]}`}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
export function Motto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width:801px)",
          motion: "(prefers-reduced-motion:no-preference)",
        },
        (match) => {
          if (!match.conditions?.motion) return;
          const section = root.current!,
            track = section.querySelector<HTMLElement>("[data-motto-track]")!;
          const scenes = [...track.querySelectorAll<HTMLElement>("[data-motto-scene]")];
          let travel: gsap.core.Tween | undefined;
          if (match.conditions.desktop) {
            const distance = () =>
              Math.max(0, track.scrollWidth - section.clientWidth + innerWidth * 0.1);
            travel = gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                id: "sr-motto",
                trigger: section,
                start: "top top",
                end: () => `+=${distance() + innerHeight * 0.8}`,
                pin: true,
                scrub: 0.6,
                invalidateOnRefresh: true,
                refreshPriority: 5,
              },
            });
          }
          scenes.forEach((scene, index) => {
            const split = SplitText.create(scene.querySelector("[data-motto-words]")!, {
              type: "chars",
              aria: "auto",
            });
            const reveal = gsap.timeline({
              scrollTrigger:
                travel && index > 0
                  ? {
                      trigger: scene,
                      containerAnimation: travel,
                      start: "left 95%",
                      end: "left 30%",
                      scrub: true,
                    }
                  : {
                      trigger: scene,
                      start: "top 90%",
                      end: "top 30%",
                      scrub: 0.6,
                    },
            });
            reveal
              .from(
                split.chars,
                {
                  yPercent: (i) => (index === 1 ? (i % 2 ? 110 : -110) : 125),
                  opacity: 0,
                  rotation: index === 1 ? 15 : 0,
                  rotationX: index === 0 ? -70 : 0,
                  scale: index === 2 ? 1.65 : 1,
                  transformOrigin: "50% 100%",
                  duration: 1,
                  stagger: 0.08,
                  ease: index === 1 ? "back.out(1.8)" : "power3.out",
                },
                0,
              )
              .from(
                scene.querySelector("[data-motto-sticker]"),
                {
                  y: index % 2 ? -130 : 130,
                  x: 60,
                  rotation: index % 2 ? 24 : -20,
                  scale: index === 3 ? 1.8 : 0.55,
                  opacity: 0,
                  duration: 1.2,
                  ease: "back.out(1.7)",
                },
                0.3,
              )
              .from(
                scene.querySelector("[data-motto-flair]"),
                {
                  rotation: index % 2 ? 160 : -160,
                  scale: 0.1,
                  opacity: 0,
                  duration: 1.3,
                  ease: "elastic.out(1,.8)",
                },
                0.25,
              );
            const curve = scene.querySelector("[data-curve]");
            if (curve) {
              reveal.from(curve, { strokeDashoffset: 1, duration: 1.5, ease: "power2.inOut" }, 0.3);
              reveal.to(
                scene.querySelector("[data-control]"),
                {
                  attr: { cx: 228, cy: 18 },
                  duration: 1.5,
                  ease: "power2.inOut",
                },
                0.3,
              );
            }
            const echo = scene.querySelector("[data-echo]");
            if (echo)
              reveal.fromTo(
                echo,
                { x: 35, y: 35, opacity: 0.6 },
                { x: 0, y: 0, opacity: 0, duration: 1, ease: "power3.out" },
                0.4,
              );
          });
          const refresh = () => ScrollTrigger.refresh();
          document.fonts.ready.then(refresh);
          const cleanups: (() => void)[] = [];
          section.querySelectorAll<HTMLButtonElement>("[data-motto-sticker]").forEach((button) => {
            const bounce = contextSafe!(() =>
              gsap.fromTo(
                button,
                { rotation: -8, scale: 0.95 },
                {
                  rotation: 0,
                  scale: 1,
                  duration: 1.1,
                  ease: "elastic.out(1,.35)",
                  overwrite: true,
                },
              ),
            );
            button.addEventListener("click", bounce);
            cleanups.push(() => button.removeEventListener("click", bounce));
          });
          return () => cleanups.forEach((fn) => fn());
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section
      data-tone="green"
      data-wave
      ref={root}
      id="process"
      className={m.section}
      aria-label="Motto Seni Religi"
    >
      <div data-motto-track className={m.track}>
        {phrases.map(([words, sticker], index) => (
          <div data-motto-scene className={m.scene} key={words}>
            <p className={m.phrase}>
              <span data-motto-words>{words}</span>
              <span className={m.stickerWrap}>
                {index === 3 && (
                  <span data-echo className={m.echo} aria-hidden="true">
                    {sticker}
                  </span>
                )}
                <button
                  data-motto-sticker
                  className={`${m.sticker} ${index % 2 ? m.green : m.yellow}`}
                >
                  {sticker}
                </button>
              </span>
            </p>
            <span data-motto-flair className={m.flairWrap}>
              <Flair index={index} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
