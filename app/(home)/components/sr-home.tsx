"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Moon,
  Sun,
  X,
  Plus,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useSiteTheme } from "@/hooks/useSiteTheme";
import { HeroWordmark, HeroScrollButton } from "./hero-wordmark";
import { CompanyReel } from "./company-reel";
import { useHomeMotion } from "./use-home-motion";
import { Draggable } from "gsap/Draggable";
import { useAktivitas } from "@/hooks/useAktivitas";
import { usePrestasi } from "@/hooks/usePrestasi";
import { useHomePage } from "@/hooks/useHomePage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { SanityActivity, SanityPrestasi } from "@/sanity/types";
import { srFields as fields } from "@/lib/sr-fields";
import { IMAGES, statusConfig } from "@/lib/types/data";
import { SrSymbol } from "./sr-symbol";
import { ParticleSignature } from "./particle-signature";
import s from "./sr-home.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, SplitText);
const accents = ["#ffe000", "#67c753", "#f2ce32", "#35b653"];
const nav = [
  ["Beranda", "/#main-content"],
  ["Tentang kami", "/tentang"],
  ["Berita & acara", "/#projects"],
  ["Delapan bidang", "/#crafts"],
  ["Prestasi", "/#publications"],
  ["Hubungi kami", "/kontak"],
];

function Eyebrow({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <p className={s.eyebrow}>
      <span>{number}</span>
      <i />
      {children}
    </p>
  );
}
function SectionTitle({
  number,
  label,
  title,
  children,
}: {
  number?: string;
  label?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={s.sectionTitle}>
      <div>
        {number && label && <Eyebrow number={number}>{label}</Eyebrow>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className={s.textLink} href={href}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}

function Island({
  dark,
  onTheme,
}: {
  dark: boolean;
  onTheme: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const root = useRef<HTMLDivElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 600px)",
        },
        (context) => {
          const duration = context.conditions?.motion ? 0.7 : 0.01;
          timeline.current = gsap
            .timeline({ paused: true })
            .to(
              "[data-island]",
              {
                width: Math.min(innerWidth - 32, 400),
                duration,
                ease: "back.out(1.8)",
                easeReverse: "power2.out",
              },
              0,
            )
            .to(
              "[data-island-brand]",
              {
                autoAlpha: 1,
                x: 0,
                duration: duration * 0.7,
                easeReverse: "power3.out",
              },
              0.05,
            )
            .to(
              "[data-menu-backdrop]",
              { autoAlpha: 1, duration: duration * 0.5 },
              0,
            )
            .fromTo(
              "[data-menu-panel]",
              { autoAlpha: 0, y: -24, scale: 0.86 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration,
                ease: "back.out(1.8)",
                easeReverse: "power3.out",
              },
              0.08,
            )
            .fromTo(
              "[data-menu-link]",
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.035,
                duration: duration * 0.5,
                easeReverse: "power2.out",
              },
              0.18,
            )
            .to(
              "[data-bar-top]",
              {
                attr: { x1: 4, y1: 4, x2: 20, y2: 20 },
                duration: duration * 0.4,
              },
              0,
            )
            .to(
              "[data-bar-bottom]",
              {
                attr: { x1: 20, y1: 4, x2: 4, y2: 20 },
                duration: duration * 0.4,
              },
              0,
            );
          if (opened.current) timeline.current.progress(1);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    opened.current = open;
    const tl = timeline.current;
    if (open) tl?.timeScale(1).play();
    else tl?.timeScale(1.5).reverse();
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const list = Array.from(
          root.current!.querySelectorAll<HTMLElement>(
            "button, a[data-menu-link]",
          ),
        );
        const index = list.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index <= 0) {
          e.preventDefault();
          list.at(-1)?.focus();
        } else if (!e.shiftKey && index === list.length - 1) {
          e.preventDefault();
          list[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className={s.navigation}
      role={open ? "dialog" : undefined}
      aria-modal={open || undefined}
      aria-label={open ? "Menu Seni Religi" : undefined}
    >
      <div
        data-menu-backdrop
        className={s.menuBackdrop}
        onClick={() => setOpen(false)}
        style={{ pointerEvents: open ? "auto" : "none" }}
      />
      <header data-island className={s.island}>
        <span className={s.islandBrand} data-island-brand>
          <Image src="/logo.png" alt="" width={28} height={32} />
          <b>
            Seni Religi<span>Universitas Brawijaya</span>
          </b>
        </span>
        <div className={s.islandButtons}>
          <button
            className={s.iconButton}
            onClick={onTheme}
            aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            ref={toggle}
            className={s.iconButton}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="sr-navigation"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line data-bar-top x1="3" y1="8" x2="21" y2="8" />
              <line data-bar-bottom x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </button>
        </div>
      </header>
      <div className={s.menuAnchor}>
        <nav
          data-menu-panel
          id="sr-navigation"
          className={s.menuPanel}
          aria-label="Navigasi utama"
          inert={!open}
        >
          <span className={s.menuCaption}>TEMUKAN RUANGMU</span>
          {nav.map(([label, href], i) => (
            <Link
              data-menu-link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {label}
              <small>0{i + 1}</small>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Motto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 801px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (match) => {
          if (!match.conditions?.motion) return;
          const section = root.current!;
          const track =
            section.querySelector<HTMLElement>("[data-motto-track]")!;
          const phrases = Array.from(track.querySelectorAll("p"));
          if (match.conditions.desktop) {
            const reveals = phrases.map((phrase, index) => {
              const split = SplitText.create(phrase.querySelector("span")!, {
                type: "chars",
                aria: "auto",
              });
              const timeline = gsap
                .timeline({ paused: true })
                .from(split.chars, {
                  y: (i) => Math.sin(i * 0.8 + index) * 85,
                  opacity: 0,
                  scale: 0.65,
                  rotation: (i) => (i % 2 ? 12 : -12),
                  stagger: 0.075,
                  duration: 0.7,
                  ease: "power2.out",
                })
                .from(
                  phrase.querySelector("button"),
                  {
                    opacity: 0,
                    scale: 0.4,
                    rotation: index % 2 ? 25 : -25,
                    duration: 0.65,
                    ease: "back.out(1.8)",
                  },
                  0.25,
                );
              const symbol = phrase.querySelector("svg");
              if (symbol)
                timeline.from(
                  symbol,
                  {
                    scale: 0,
                    rotation: -120,
                    duration: 0.7,
                    ease: "back.out(2)",
                  },
                  0.35,
                );
              return timeline;
            });
            const revealVisible = () => {
              const entry = gsap.utils.clamp(
                0,
                1,
                (innerHeight * 0.9 - section.getBoundingClientRect().top) /
                  (innerHeight * 0.7),
              );
              phrases.forEach((phrase, index) => {
                const progress = gsap.utils.clamp(
                  0,
                  1,
                  (innerWidth * 0.95 - phrase.getBoundingClientRect().left) /
                    (innerWidth * 0.45),
                );
                reveals[index].progress(Math.min(entry, progress));
              });
            };
            ScrollTrigger.create({
              trigger: section,
              start: "top bottom",
              end: "top top",
              onUpdate: revealVisible,
              onRefresh: revealVisible,
            });
            // Measure the actual content viewport, including both section gutters and rotated sticker overscan.
            const distance = () => {
              const css = getComputedStyle(section);
              return Math.max(
                0,
                track.scrollWidth -
                  section.clientWidth +
                  parseFloat(css.paddingLeft) +
                  parseFloat(css.paddingRight) +
                  80,
              );
            };
            gsap
              .timeline({
                scrollTrigger: {
                  id: "sr-motto",
                  trigger: section,
                  pin: true,
                  start: "top top",
                  end: () => `+=${distance() + innerHeight * 0.6}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                  refreshPriority: 5,
                  onUpdate: revealVisible,
                },
              })
              .to(track, { x: () => -distance(), duration: 1, ease: "none" })
              .to({}, { duration: 0.25 });
          } else {
            phrases.forEach((phrase) =>
              gsap.from(phrase.children, {
                y: 25,
                autoAlpha: 0,
                filter: "blur(6px)",
                stagger: 0.14,
                duration: 0.85,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: phrase,
                  start: "top 85%",
                  once: true,
                },
              }),
            );
          }
          const cleanups: (() => void)[] = [];
          track
            .querySelectorAll<HTMLElement>("[data-sticker]")
            .forEach((sticker) => {
              const enter = contextSafe!(() =>
                gsap.to(sticker, {
                  y: -14,
                  scale: 1.09,
                  rotation: 4,
                  duration: 0.55,
                  ease: "elastic.out(1,.5)",
                  overwrite: true,
                }),
              );
              const leave = contextSafe!(() =>
                gsap.to(sticker, {
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 0.7,
                  ease: "elastic.out(1,.5)",
                  overwrite: true,
                }),
              );
              const click = contextSafe!(() =>
                gsap.fromTo(
                  sticker,
                  { scale: 0.85, rotation: -8 },
                  {
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    ease: "elastic.out(1,.35)",
                    overwrite: true,
                  },
                ),
              );
              sticker.addEventListener("pointerenter", enter);
              sticker.addEventListener("pointerleave", leave);
              sticker.addEventListener("click", click);
              sticker.addEventListener("focus", enter);
              sticker.addEventListener("blur", leave);
              cleanups.push(() => {
                sticker.removeEventListener("pointerenter", enter);
                sticker.removeEventListener("pointerleave", leave);
                sticker.removeEventListener("click", click);
                sticker.removeEventListener("focus", enter);
                sticker.removeEventListener("blur", leave);
              });
            });
          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      id="process"
      className={s.motto}
      aria-label="Motto Seni Religi"
    >
      <div data-motto-track className={s.mottoTrack}>
        <p>
          <span>Hidup itu</span> <button data-sticker>Seni.</button>
          <SrSymbol index={4} />
        </p>
        <p>
          <span>Seni itu</span> <button data-sticker>Indah.</button>
          <SrSymbol index={5} />
        </p>
        <p>
          <span>Indah itu</span> <button data-sticker>Baik.</button>
          <SrSymbol index={0} />
        </p>
        <p>
          <span>Yang Baik</span> <button data-sticker>disenangi.</button>
        </p>
      </div>
    </section>
  );
}

function NewsCover({ src, index }: { src: string; index: number }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 800px) 85vw, 36vw"
      onError={() => setFailed(true)}
      onLoad={() => ScrollTrigger.refresh()}
    />
  ) : (
    <div className={s.imageFallback}>
      <SrSymbol index={index} />
      <span>DOKUMENTASI SENI RELIGI</span>
    </div>
  );
}

function NewsGallery({
  id,
  items,
  loading,
  error,
  onSelect,
  title,
}: {
  id: string;
  items: SanityActivity[];
  loading: boolean;
  error: boolean;
  onSelect: (a: SanityActivity) => void;
  title: string;
}) {
  const root = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null),
    viewport = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!items.length) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(
              0,
              track.current!.scrollWidth - viewport.current!.clientWidth,
            );
          if (distance() < 2) return;
          gsap.to(track.current, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              pin: true,
              start: "top 96px",
              end: () => `+=${distance()}`,
              scrub: 0.7,
              invalidateOnRefresh: true,
              refreshPriority: id === "projects" ? 3 : 1,
            },
          });
        },
      );
      const refresh = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => {
        cancelAnimationFrame(refresh);
        mm.revert();
      };
    },
    { scope: root, dependencies: [items.length], revertOnUpdate: true },
  );
  return (
    <section ref={root} id={id} className={`${s.section} ${s.news}`}>
      <SectionTitle title={title}>
        <TextLink href="/aktivitas">Lihat selengkapnya</TextLink>
      </SectionTitle>
      <div
        ref={viewport}
        className={s.galleryViewport}
        tabIndex={items.length ? 0 : undefined}
        aria-label="Galeri, geser untuk menjelajahi"
      >
        <div ref={track} className={s.galleryTrack}>
          {items.map((a, i) => (
            <article key={a._id} className={s.newsCard}>
              <button
                className={s.newsImage}
                onClick={() => onSelect(a)}
                aria-label={`Baca ringkasan ${a.title}`}
              >
                <NewsCover key={a.imageUrl} src={a.imageUrl} index={i} />
                <span className={s.imageArrow}>
                  <ArrowUpRight />
                </span>
                <span className={s.imageIndex}>0{i + 1}</span>
              </button>
              <div className={s.newsMeta}>
                <span>
                  {a.category || (a.type === "event" ? "Acara" : "Cerita")}
                </span>
                <button onClick={() => onSelect(a)}>
                  {a.status ? statusConfig[a.status]?.label : "Baca cerita"}
                  <Plus size={12} />
                </button>
              </div>
              <button className={s.newsTitle} onClick={() => onSelect(a)}>
                {a.title}
              </button>
              <p className={s.newsDescription}>{a.description}</p>
            </article>
          ))}
          {!items.length && (
            <div className={s.emptyNews}>
              <SrSymbol index={4} />
              <h3>
                {loading
                  ? "Menyiapkan cerita…"
                  : error
                    ? "Cerita belum dapat dimuat"
                    : "Cerita berikutnya sedang dirangkai."}
              </h3>
              <p>
                {error
                  ? "Coba muat ulang halaman untuk melihat pembaruan."
                  : "Kabar dan kegiatan yang dipublikasikan akan hadir di sini."}
              </p>
              <TextLink href="/aktivitas">Jelajahi aktivitas</TextLink>
            </div>
          )}
        </div>
      </div>
      {items.length > 1 && (
        <p className={s.galleryHint}>
          Gulir atau geser untuk menjelajahi <ArrowRight size={16} />
        </p>
      )}
    </section>
  );
}

function Fields() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    if (active !== null)
      root.current
        ?.querySelector<HTMLButtonElement>(`#field-${active} button`)
        ?.focus({ preventScroll: true });
  }, [active]);
  useGSAP(
    (_ctx, contextSafe) => {
      const stage = root.current!;
      const cards = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-field]"),
      );
      const move = contextSafe!((e: PointerEvent) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(max-width: 800px), (prefers-reduced-motion: reduce)")
            .matches
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
      root
        .current!.querySelectorAll<HTMLElement>(`.${s.fieldInner}`)
        .forEach((card, i) => {
          gsap.to(card, {
            rotationY: active === i ? 180 : 0,
            duration: reduced ? 0 : 0.85,
            ease: "back.out(1.25)",
            overwrite: true,
          });
          if (active === i && !reduced)
            gsap.fromTo(
              card.querySelectorAll(
                `.${s.fieldBack} h3, .${s.fieldBack} p, .${s.fieldBack}>a`,
              ),
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
    <section id="crafts" className={`${s.section} ${s.fields}`}>
      <SectionTitle title="Temukan minat dan bakat mu" />
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
            <div className={s.fieldInner}>
              <button
                className={s.fieldFront}
                onClick={() => setActive(active === i ? null : i)}
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
                        ?.querySelectorAll<HTMLButtonElement>(
                          `button.${s.fieldFront}`,
                        )
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
        ))}
      </div>
    </section>
  );
}

function Achievements({
  items,
  loading,
  error,
}: {
  items: SanityPrestasi[];
  loading: boolean;
  error: boolean;
}) {
  const root = useRef<HTMLDivElement>(null),
    proxy = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const moveRef = useRef<(delta: number) => void>(() => {});
  useEffect(() => {
    moveRef.current = (delta) =>
      setIndex((v) =>
        items.length ? (v + delta + items.length) % items.length : 0,
      );
  }, [items.length]);
  useGSAP(
    () => {
      if (items.length < 2) return;
      const [drag] = Draggable.create(proxy.current!, {
        type: "x",
        trigger: root.current!,
        allowNativeTouchScrolling: true,
        minimumMovement: 12,
        onDragEnd() {
          const delta = this.x - this.startX;
          if (Math.abs(delta) > 30) moveRef.current(delta < 0 ? 1 : -1);
          gsap.set(proxy.current, { x: 0 });
        },
      });
      return () => drag.kill();
    },
    { dependencies: [items.length] },
  );
  useGSAP(
    () => {
      const cards = root.current!.querySelectorAll("[data-award]");
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const gap = Math.min(innerWidth * 0.48, 295);
      cards.forEach((card, i) => {
        let offset = (i - index + items.length) % items.length;
        if (offset > items.length / 2) offset -= items.length;
        gsap.to(card, {
          x: offset * gap,
          scale: offset === 0 ? 1 : 0.82,
          rotation: offset * 5,
          opacity: Math.abs(offset) > 2 ? 0 : offset === 0 ? 1 : 0.4,
          zIndex: 10 - Math.abs(offset),
          duration: reduced ? 0 : 0.65,
          ease: "power3.out",
          overwrite: true,
        });
      });
    },
    { scope: root, dependencies: [index, items.length] },
  );
  return (
    <section id="publications" className={`${s.section} ${s.achievements}`}>
      <SectionTitle title="Kabar Prestasi terbaru">
        <TextLink href="/prestasi">Semua prestasi</TextLink>
      </SectionTitle>
      <div
        ref={root}
        className={s.awardStage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Prestasi Seni Religi"
        tabIndex={items.length > 1 ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            moveRef.current(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {items.length ? (
          items.map((a, i) => (
            <article
              key={a._id}
              data-award
              className={s.awardCard}
              aria-hidden={i !== index}
              inert={i !== index}
              style={{ "--accent": accents[i % 4] } as CSSProperties}
            >
              <div className={s.awardTop}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{a.year}</span>
              </div>
              <div className={s.awardPhoto}>
                {a.imageUrl ? (
                  <Image
                    src={a.imageUrl}
                    alt={a.imageAlt || a.title}
                    fill
                    sizes="(max-width: 800px) 70vw, 300px"
                  />
                ) : (
                  <span>Dokumentasi prestasi</span>
                )}
              </div>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <TextLink href="/prestasi">Lihat prestasi</TextLink>
            </article>
          ))
        ) : (
          <>
            <div className={s.awardGhost} aria-hidden="true">
              <SrSymbol index={2} />
            </div>
            <div className={s.awardGhost} aria-hidden="true">
              <SrSymbol index={0} />
            </div>
            <article className={`${s.awardCard} ${s.awardEmpty}`}>
              <span className={s.awardTop}>01</span>
              <div className={s.awardPhoto}>
                <span>Dokumentasi prestasi</span>
              </div>
              <h3>
                {loading
                  ? "Memuat jejak kami…"
                  : error
                    ? "Arsip belum dapat dimuat."
                    : "Jejak baik akan hadir di sini."}
              </h3>
              <p>
                {error
                  ? "Silakan coba muat ulang halaman."
                  : "Catatan prestasi belum dipublikasikan. Setiap pencapaian akan mendapat ruangnya."}
              </p>
              <TextLink href="/prestasi">Jelajahi prestasi</TextLink>
            </article>
          </>
        )}
      </div>
      {items.length > 0 && (
        <div className={s.carouselControls}>
          <button
            aria-label="Prestasi sebelumnya"
            disabled={items.length < 2}
            onClick={() => moveRef.current(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <span aria-live="polite">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <button
            aria-label="Prestasi berikutnya"
            disabled={items.length < 2}
            onClick={() => moveRef.current(1)}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
      <div ref={proxy} className={s.dragProxy} />
    </section>
  );
}

type Popup =
  | { kind: "news"; item: SanityActivity }
  | { kind: "video" | "privacy" | "terms" };
function videoSource(url?: string) {
  if (!url) return null;
  try {
    const p = new URL(url);
    if (p.protocol !== "https:") return null;
    const host = p.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? p.pathname.slice(1)
        : ["youtube.com", "m.youtube.com"].includes(host)
          ? p.searchParams.get("v") ||
            p.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
          : null;
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id))
      return {
        kind: "embed",
        url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
      };
    if (/\.mp4$/i.test(p.pathname)) return { kind: "video", url };
  } catch {
    return null;
  }
  return null;
}
function PopupDialog({
  popup,
  close,
  videoUrl,
}: {
  popup: Popup;
  close: () => void;
  videoUrl?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { contextSafe } = useGSAP(
    () => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.from(`.${s.dialogContent}`, {
          y: 28,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        });
    },
    { scope: ref },
  );
  const closeAnimated = contextSafe(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) close();
    else
      gsap.to(`.${s.dialogContent}`, {
        y: 15,
        opacity: 0,
        duration: 0.2,
        onComplete: close,
      });
  });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const video = videoSource(videoUrl);
  return (
    <dialog
      ref={ref}
      className={s.dialog}
      onCancel={(e) => {
        e.preventDefault();
        closeAnimated();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAnimated();
      }}
      aria-labelledby="popup-title"
    >
      <div className={s.dialogContent}>
        <button
          autoFocus
          className={s.closeDialog}
          aria-label="Tutup dialog"
          onClick={closeAnimated}
        >
          <X />
        </button>
        {popup.kind === "news" ? (
          <>
            <span className={s.eyebrow}>
              {popup.item.category}{" "}
              {popup.item.status &&
                ` / ${statusConfig[popup.item.status]?.label}`}
            </span>
            <h2 id="popup-title">{popup.item.title}</h2>
            <p>
              {popup.item.description ||
                "Baca cerita lengkap dan informasi kegiatan ini di halaman detail."}
            </p>
            {popup.item.location && (
              <p className={s.dialogLocation}>{popup.item.location}</p>
            )}
            <Link className={s.pillCta} href={`/aktivitas/${popup.item.slug}`}>
              Lihat selengkapnya
              <ArrowUpRight size={18} />
            </Link>
          </>
        ) : popup.kind === "video" ? (
          <>
            <h2 id="popup-title">Seni Religi — Company profile</h2>
            {video ? (
              video.kind === "embed" ? (
                <iframe
                  title="Video company profile Seni Religi"
                  src={video.url}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video src={video.url} controls autoPlay playsInline />
              )
            ) : (
              <div className={s.videoEmpty}>
                <Image src="/logo.png" width={65} height={72} alt="" />
                <p>
                  Video resmi belum ditambahkan.
                  <br />
                  Sementara itu, kenali keluarga Seni Religi.
                </p>
                <TextLink href="/tentang">Tentang kami</TextLink>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 id="popup-title">
              {popup.kind === "privacy"
                ? "Kebijakan Privasi"
                : "Ketentuan Penggunaan"}
            </h2>
            <p>
              {popup.kind === "privacy"
                ? "Pilihan tema disimpan di browser Anda. Video YouTube, ketika diputar, dimuat melalui layanan pihak ketiga."
                : "Website ini memuat informasi, karya, dan kegiatan Seni Religi Universitas Brawijaya."}
            </p>
            <p>
              Dokumen resmi akan dilengkapi oleh pengelola SR sebelum publikasi
              website.
            </p>
            <TextLink href="/kontak">Hubungi pengelola</TextLink>
          </>
        )}
      </div>
    </dialog>
  );
}

export default function SrHome() {
  const root = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useSiteTheme();
  const [popup, setPopup] = useState<Popup | null>(null);
  const themeBusy = useRef(false);
  const { data: home } = useHomePage();
  const { data: settings } = useSiteSettings();
  const activities = useAktivitas(),
    achievements = usePrestasi();
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    return () => {
      disposed = true;
    };
  }, []);
  const changeTheme = async (e: MouseEvent<HTMLButtonElement>) => {
    if (themeBusy.current) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = r.left + r.width / 2,
      y = r.top + r.height / 2;
    const update = () => {
      flushSync(() => setDark(!dark));
    };
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      update();
      return;
    }
    themeBusy.current = true;
    try {
      const transition = document.startViewTransition(update);
      await transition.ready;
      const radius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      );
      await document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(.2,.7,.2,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      ).finished;
      await transition.finished;
    } catch {
      /* The new theme remains applied when a browser cancels its transition. */
    } finally {
      themeBusy.current = false;
    }
  };
  useHomeMotion(root, activities.data?.length ?? 0);
  const all = activities.data ?? [];
  return (
    <div ref={root} className={s.site} data-theme={dark ? "dark" : "light"}>
      <a href="#main-content" className={s.skip}>
        Lewati ke konten
      </a>
      <Island dark={dark} onTheme={changeTheme} />
      <main id="main-content" tabIndex={-1}>
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroTop}>
            <Link href="/" className={s.brand}>
              <Image
                src="/logo.png"
                alt="Logo Seni Religi"
                width={38}
                height={38}
              />
              <span>
                SENI RELIGI<small>UNIVERSITAS BRAWIJAYA</small>
              </span>
            </Link>
          </div>
          <div className={s.heroMain}>
            <HeroWordmark />
          </div>
          <div className={s.heroBottom}>
            <HeroScrollButton />
          </div>
        </section>
        <Motto />
        <CompanyReel
          poster={home?.companyVideoPosterUrl || IMAGES.stage}
          onPlay={() => setPopup({ kind: "video" })}
        />
        <NewsGallery
          id="projects"
          items={all}
          loading={activities.isLoading}
          error={activities.isError}
          onSelect={(item) => setPopup({ kind: "news", item })}
          title="Berita & Acara"
        />
        <Fields />
        {!!home?.partners?.length && (
          <section id="partners" className={s.section}>
            <SectionTitle
              number="+"
              label="TUMBUH BERSAMA"
              title="Ruang untuk berkolaborasi."
            />
            <div className={s.partnerGrid}>
              {home.partners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url || "/kontak"}
                  className={s.partner}
                  target={partner.url ? "_blank" : undefined}
                  rel={partner.url ? "noreferrer" : undefined}
                >
                  {partner.logoUrl ? (
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={180}
                      height={90}
                    />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}
        <Achievements
          items={achievements.data ?? []}
          loading={achievements.isLoading}
          error={achievements.isError}
        />
        <section id="contact" className={`${s.section} ${s.contact}`}>
          <h2>
            Ada ide?
            <br />
            Mari <em>bertemu.</em>
            <button
              data-contact-play
              className={s.contactPlay}
              aria-label="Animasikan logo Seni Religi"
            >
              <Image
                src="/logo.png"
                alt="Logo Seni Religi Universitas Brawijaya"
                width={220}
                height={220}
              />
            </button>
          </h2>
          <div>
            <p>
              Untuk berkarya, berkolaborasi,
              <br />
              atau sekadar mengenal lebih dekat.
            </p>
            <Link href="/kontak" className={s.pillCta}>
              Mulai percakapan
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <div className={s.footerInfo}>
          <Link className={s.brand} href="/">
            <Image src="/logo.png" alt="" width={38} height={43} />
            <span>
              SENI RELIGI<small>UNIVERSITAS BRAWIJAYA</small>
            </span>
          </Link>
          <p>
            Malang, Jawa Timur
            <br />
            Indonesia
          </p>
          <div>
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
                <ArrowUpRight size={14} />
              </a>
            )}
            {settings?.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer">
                YouTube
                <ArrowUpRight size={14} />
              </a>
            )}
            <Link href="/kontak">
              Kontak
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <ParticleSignature />
        <div className={s.legal}>
          <span>
            © {new Date().getFullYear()} Seni Religi Universitas Brawijaya.
          </span>
          <div>
            <button onClick={() => setPopup({ kind: "privacy" })}>
              Privasi
            </button>
            <button onClick={() => setPopup({ kind: "terms" })}>
              Ketentuan
            </button>
          </div>
        </div>
      </footer>
      {popup && (
        <PopupDialog
          popup={popup}
          close={() => setPopup(null)}
          videoUrl={home?.companyVideoUrl}
        />
      )}
    </div>
  );
}
