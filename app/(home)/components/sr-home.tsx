"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Plus } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Motto } from "./motto";
import { HeroWordmark, HeroScrollButton } from "./hero-wordmark";
import { CompanyReel } from "./company-reel";
import { useFieldPlayground } from "./use-field-playground";
import { useHomeMotion } from "./use-home-motion";
import { Draggable } from "gsap/Draggable";
import { useAktivitas } from "@/hooks/useAktivitas";
import { usePrestasi } from "@/hooks/usePrestasi";
import { useHomePage } from "@/hooks/useHomePage";

import type { SanityActivity, SanityPrestasi } from "@/sanity/types";
import { srFields as fields } from "@/lib/sr-fields";
import { IMAGES, statusConfig } from "@/lib/types/data";
import { SrSymbol } from "./sr-symbol";
import Footer from "@/components/footer";
import SiteHeader from "@/components/site-header";
import s from "./sr-home.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);
const accents = ["#e9e4cb", "#d8e2d1", "#f0ead8", "#c7d6c3"];


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
          gsap.set(viewport.current, { clearProps: "transform" });
          viewport.current!.scrollLeft = 0;
          const distance = () =>
            Math.max(
              0,
              track.current!.scrollWidth - viewport.current!.clientWidth,
            );
          gsap.fromTo(
            track.current,
            {
              x: () => viewport.current!.clientWidth + 24,
            },
            {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                pin: true,
                start: "top -96px",
                end: () =>
                  `+=${viewport.current!.clientWidth + distance() + 24}`,
                scrub: 0.7,
                invalidateOnRefresh: true,
                refreshPriority: id === "projects" ? 3 : 1,
              },
            },
          );
        },
      );
      mm.add(
        "(max-width: 800px)",
        () => {
          gsap.set(track.current, { clearProps: "transform" });
          viewport.current!.scrollLeft = 0;
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          // Move the viewport, not its scrollable track: transforming the track
          // changes its scroll bounds and makes native swipe/snap jump on mobile.
          gsap.fromTo(
            viewport.current,
            { x: () => viewport.current!.clientWidth + 24 },
            {
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top 75%",
                end: "top 10%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            },
          );
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
    <section
      data-tone="green"
      data-wave
      ref={root}
      id={id}
      className={`${s.section} ${s.news}`}
    >
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

function MobileFields() {
  return (
    <div className={s.mobileFields}>
      <div className={s.mobileFieldIntro}>
        <p>Delapan bidang, banyak cara berkarya.<br />Ketuk bidang untuk mengenalnya.</p>
      </div>
      {[fields.slice(0, 4), fields.slice(4)].map((row, rowIndex) => (
        <div className={s.fieldMarquee} key={rowIndex}>
          <div className={s.fieldMarqueeTrack}>
            {[0, 1].map((copy) => (
              <div className={s.fieldMarqueeGroup} key={copy} aria-hidden={copy === 1}>
                {row.map((field, index) => (
                  <Link key={field.slug} href={`/tentang/bidang/${field.slug}`} tabIndex={copy === 1 ? -1 : undefined}>
                    <span>{field.name}</span>
                    <span className={s.marqueeSymbol} aria-hidden="true"><SrSymbol index={rowIndex * 4 + index} /></span>
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

function Fields() {
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
    <section
      data-tone="cream"
      data-wave
      id="crafts"
      className={`${s.section} ${s.fields}`}
    >
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
        Klik dan tahan untuk menarik kartu. Lepaskan untuk menaruhnya, atau klik untuk mengenal bidangnya.
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
                    if (!playground.suppressClick())
                      setActive(active === i ? null : i);
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
          </div>
        ))}
      </div>
    </section>
  );
}

function Achievements({
  tone,
  items,
  loading,
  error,
}: {
  tone: "cream" | "green";
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
    <section
      data-tone={tone}
      data-wave
      id="publications"
      className={`${s.section} ${s.achievements}`}
    >
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
                ? "Video YouTube, ketika diputar, dimuat melalui layanan pihak ketiga."
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
  const [popup, setPopup] = useState<Popup | null>(null);
  const { data: home } = useHomePage();

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
  useHomeMotion(root, activities.data?.length ?? 0);
  const all = activities.data ?? [];
  return (
    <div ref={root} className={s.site}>
      <a href="#main-content" className={s.skip}>
        Lewati ke kontend
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section
          data-tone="cream"
          className={s.hero}
          aria-labelledby="hero-title"
        >
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
          <section
            data-tone="green"
            data-wave
            id="partners"
            className={s.section}
          >
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
          tone={home?.partners?.length ? "cream" : "green"}
          items={achievements.data ?? []}
          loading={achievements.isLoading}
          error={achievements.isError}
        />
        <section
          data-tone={home?.partners?.length ? "green" : "cream"}
          data-wave
          id="contact"
          className={`${s.section} ${s.contact}`}
        >
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
      <Footer />
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

