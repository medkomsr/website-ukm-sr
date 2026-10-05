"use client";
import { SrSymbol } from "@/components/brand/art-symbol";
import { useFieldPlayground } from "@/features/home/hooks/use-field-playground";
import { srFields as fields } from "@/lib/constants/art-fields";
import { FIELD_ACCENTS as accents } from "@/lib/constants/home-content";
import s from "@/styles/experience.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowUpRight, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionTitle } from "./section-heading";
gsap.registerPlugin(useGSAP);
function MobileFields() {
  return (
    <div className={s.mobileFields}>
      <div className={s.mobileFieldIntro}>
        <p>
          Delapan bidang, banyak cara berkarya.
          <br />
          Ketuk bidang untuk mengenalnya.
        </p>
      </div>
      {[fields.slice(0, 4), fields.slice(4)].map((row, rowIndex) => (
        <div className={s.fieldMarquee} key={rowIndex}>
          <div className={s.fieldMarqueeTrack}>
            {[0, 1].map((copy) => (
              <div className={s.fieldMarqueeGroup} key={copy} aria-hidden={copy === 1}>
                {row.map((field, index) => (
                  <Link
                    key={field.slug}
                    href={`/tentang/bidang/${field.slug}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    <span>{field.name}</span>
                    <span className={s.marqueeSymbol} aria-hidden="true">
                      <SrSymbol index={rowIndex * 4 + index} />
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Fields() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const playground = useFieldPlayground(root);
  useEffect(() => {
    if (active !== null)
      root.current
        ?.querySelector<HTMLButtonElement>(`#field-${active} button`)
        ?.focus({ preventScroll: true });
  }, [active]);
  useGSAP(
    (_ctx, contextSafe) => {
      const stage = root.current!;
      const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-field]"));
      const move = contextSafe!((e: PointerEvent) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(max-width: 800px), (prefers-reduced-motion: reduce)").matches
        )
          return;
        const bounds = stage.getBoundingClientRect();
        cards.forEach((card, i) => {
          const distance = Math.hypot(
            e.clientX - bounds.left - card.offsetLeft - card.offsetWidth / 2,
            e.clientY - bounds.top - card.offsetTop - card.offsetHeight / 2,
          );
          const proximity = Math.max(0, 1 - distance / 260);
          gsap.to(card.querySelector("[data-field-symbol]"), {
            scale: i === active ? 1 : 1 + 0.65 * proximity,
            duration: 0.35,
            overwrite: true,
            ease: "power2.out",
          });
        });
      });
      const leave = contextSafe!(() => {
        gsap.to("[data-field-symbol]", {
          scale: 1,
          duration: 0.5,
          overwrite: true,
        });
      });
      stage.addEventListener("pointermove", move);
      stage.addEventListener("pointerleave", leave);
      return () => {
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.current!.querySelectorAll<HTMLElement>(`.${s.fieldInner}`).forEach((card, i) => {
        gsap.to(card, {
          rotationY: active === i ? 180 : 0,
          duration: reduced ? 0 : 0.85,
          ease: "back.out(1.25)",
          overwrite: true,
        });
        if (active === i && !reduced)
          gsap.fromTo(
            card.querySelectorAll(`.${s.fieldBack} h3, .${s.fieldBack} p, .${s.fieldBack}>a`),
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.07,
              delay: 0.25,
              duration: 0.5,
              overwrite: true,
            },
          );
      });
    },
    { scope: root, dependencies: [active] },
  );
  return (
    <section data-tone="cream" data-wave id="crafts" className={`${s.section} ${s.fields}`}>
      <SectionTitle title="Temukan minat dan bakat mu">
        <button
          className={s.resetFields}
          onClick={() => {
            setActive(null);
            playground.reset();
          }}
        >
          Kembalikan susunan <span aria-hidden="true">↺</span>
        </button>
      </SectionTitle>
      <p className={s.fieldHint} id="field-help">
        Klik dan tahan untuk menarik kartu. Lepaskan untuk menaruhnya, atau klik untuk mengenal
        bidangnya.
      </p>
      <MobileFields />
      <div ref={root} className={s.fieldStage}>
        {fields.map((field, i) => (
          <div
            data-field
            key={field.slug}
            className={s.field}
            data-open={active === i}
            style={
              {
                "--accent": accents[i % 4],
                "--turn": `${[-5, 3, -3, 4, 3, -4, 4, -3][i]}deg`,
              } as CSSProperties
            }
          >
            <div data-field-float className={s.fieldFloat}>
              <div className={s.fieldInner}>
                <button
                  className={s.fieldFront}
                  onClick={() => {
                    if (!playground.suppressClick()) setActive(active === i ? null : i);
                  }}
                  aria-describedby="field-help"
                  onKeyDown={(event) => {
                    const offsets: Record<string, [number, number]> = {
                      ArrowLeft: [-24, 0],
                      ArrowRight: [24, 0],
                      ArrowUp: [0, -24],
                      ArrowDown: [0, 24],
                    };
                    if (offsets[event.key]) {
                      event.preventDefault();
                      playground.move(i, ...offsets[event.key]);
                    }
                  }}
                  aria-expanded={active === i}
                  aria-controls={`field-${i}`}
                  tabIndex={active === i ? -1 : 0}
                  aria-hidden={active === i}
                >
                  <span className={s.fieldNumber}>0{i + 1}</span>
                  <span data-field-symbol>
                    <SrSymbol index={i} />
                  </span>
                  <h3>{field.name}</h3>
                  <span className={s.fieldPlus}>
                    <Plus size={15} />
                  </span>
                </button>
                <div
                  id={`field-${i}`}
                  className={s.fieldBack}
                  inert={active !== i}
                  aria-hidden={active !== i}
                >
                  <button
                    className={s.closeField}
                    onClick={() => {
                      setActive(null);
                      requestAnimationFrame(() =>
                        root.current
                          ?.querySelectorAll<HTMLButtonElement>(`button.${s.fieldFront}`)
                          [i]?.focus({ preventScroll: true }),
                      );
                    }}
                    aria-label={`Tutup ${field.name}`}
                  >
                    <X size={18} />
                  </button>
                  <span className={s.fieldNumber}>BIDANG / 0{i + 1}</span>
                  <h3>{field.name}</h3>
                  <p>{field.text}</p>
                  <Link href={`/tentang/bidang/${field.slug}`}>
                    Lihat detail
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
