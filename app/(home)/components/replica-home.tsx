"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionPiece } from "./motion-piece";
import { HeroPointerTrail } from "./hero-pointer-trail";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Moon,
  Sun,
  X,
  Menu,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import GsapStage from "@/components/gsap-stage";
import { useHomePage } from "@/hooks/useHomePage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAktivitas } from "@/hooks/useAktivitas";
import { usePrestasi } from "@/hooks/usePrestasi";

import { placeMagnet, type MagnetRect } from "@/lib/magnet-collision";
import { IMAGES } from "@/lib/types/data";
import s from "./replica-home.module.css";

gsap.registerPlugin(useGSAP, Draggable, ScrollTrigger);
const colors = ["#376fcb", "#fa3d45", "#f7bd20", "#07865f"];
const navigation = [
  ["Beranda", "/"],
  ["Tentang SR", "/tentang"],
  ["Karya", "/galeri"],
  ["Prestasi", "/prestasi"],
  ["Bidang", "/#crafts"],
  ["Aktivitas", "/aktivitas"],
  ["Kontak", "/kontak"],
];
const words = [
  "Kami.",
  "Berkarya.",
  "Eksplorasi.",
  "Berlatih.",
  "Berbagi.",
  "Rasa.",
  "Belajar.",
  "Doa.",
  "Bersama.",
  "Tumbuh.",
];
const meanings = [
  "Satu keluarga Seni Religi.",
  "Dari hati, menjadi karya.",
  "Temukan kemungkinan baru.",
  "Tekun dalam setiap proses.",
  "Seni yang membawa kebaikan.",
  "Mendengar dengan hati.",
  "Selalu terbuka untuk ilmu.",
  "Menguatkan setiap langkah.",
  "Saling menjaga dan mendukung.",
  "Lebih baik, setiap hari.",
];

function Shape({
  type = 0,
  className = "",
}: {
  type?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
    >
      {type % 6 === 0 && (
        <path d="M50 0C50 30 70 50 100 50 70 50 50 70 50 100 50 70 30 50 0 50 30 50 50 30 50 0Z" />
      )}
      {type % 6 === 1 && (
        <path fillRule="evenodd" d="M0 0H100V100H0ZM22 22V78H78V22Z" />
      )}
      {type % 6 === 2 && (
        <path d="M0 0C28 0 50 22 50 50 22 50 0 28 0 0ZM50 0C78 0 100 22 100 50 72 50 50 28 50 0ZM0 100C0 72 22 50 50 50 50 78 28 100 0 100ZM50 100C50 72 72 50 100 50 100 78 78 100 50 100Z" />
      )}
      {type % 6 === 3 && (
        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
        />
      )}
      {type % 6 === 4 && <path d="M40 0H60V40H100V60H60V100H40V60H0V40H40Z" />}
      {type % 6 === 5 && (
        <path d="M0 0H100C100 28 78 50 50 50 78 50 100 72 100 100H0C0 72 22 50 50 50 22 50 0 28 0 0Z" />
      )}
    </svg>
  );
}
function Chapter({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className={s.chapter}>
      <i style={{ background: colors[Number(n) % 4] }} />
      {n}
      <span />
      {children}
    </div>
  );
}
function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className={s.more} href={href}>
      {children}
      <span>
        <ArrowRight size={15} />
      </span>
    </Link>
  );
}

function Process() {
  const board = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<number | null>(null);
  const controls = useRef<{
    move: (index: number, dx: number, dy: number, home: boolean) => void;
    reset: () => void;
  } | null>(null);
  useGSAP(
    () => {
      const container = board.current!;
      const cards = Array.from(
        container.querySelectorAll<HTMLButtonElement>("[data-word]"),
      );
      let origins: MagnetRect[] = [];
      let positions: MagnetRect[] = [];
      let bounds = { width: 0, height: 0 };
      let disposed = false;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      const gap = () => (container.clientWidth < 600 ? 4 : 8);

      const render = (next: MagnetRect[], active: number, animate = true) => {
        positions = next;
        cards.forEach((card, i) => {
          const x = next[i].x - origins[i].x,
            y = next[i].y - origins[i].y;
          if (i === active || !animate || reduced.matches) {
            gsap.killTweensOf(card);
            gsap.set(card, { x, y });
            Draggable.get(card)?.update();
          } else {
            gsap.to(card, {
              x,
              y,
              duration: 0.18,
              ease: "power2.out",
              overwrite: true,
              onUpdate: () => {
                Draggable.get(card)?.update();
              },
            });
          }
        });
      };
      const arrange = (index: number, x: number, y: number) => {
        if (!origins.length) return;
        render(placeMagnet(positions, index, x, y, bounds, gap()), index);
      };
      const drags = cards.flatMap((card, index) =>
        Draggable.create(card, {
          type: "x,y",
          bounds: container,
          edgeResistance: 1,
          minimumMovement: 8,
          dragClickables: true,
          cursor: "grab",
          activeCursor: "grabbing",
          onPressInit() {
            // Finish pending neighbour motion before taking over a different magnet.
            if (positions.length) render(positions, index, false);
          },
          onDrag() {
            arrange(
              index,
              origins[index].x + this.x,
              origins[index].y + this.y,
            );
          },
          onDragEnd() {
            // Commit the valid arrangement; no lingering overlap after release.
            if (positions.length) render(positions, index, false);
          },
        }),
      );
      const measure = () => {
        if (disposed) return;
        cards.forEach((card) => {
          gsap.killTweensOf(card);
          gsap.set(card, { x: 0, y: 0 });
        });
        const rect = container.getBoundingClientRect();
        origins = cards.map((card) => {
          const r = card.getBoundingClientRect();
          return {
            x: r.left - rect.left,
            y: r.top - rect.top,
            width: r.width,
            height: r.height,
          };
        });
        // Tiny rotations can extend past the nominal edge; preserve the resting layout.
        const left = Math.min(0, ...origins.map((r) => r.x));
        const top = Math.min(0, ...origins.map((r) => r.y));
        bounds = {
          width:
            Math.max(rect.width, ...origins.map((r) => r.x + r.width)) - left,
          height:
            Math.max(rect.height, ...origins.map((r) => r.y + r.height)) - top,
        };
        origins = origins.map((r) => ({ ...r, x: r.x - left, y: r.y - top }));
        positions = origins.map((r) => ({ ...r }));
        drags.forEach((d) => d.update(true));
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(container);
      document.fonts.ready.then(measure);
      controls.current = {
        move(index, dx, dy, home) {
          const current = home ? origins[index] : positions[index];
          arrange(index, current.x + dx, current.y + dy);
        },
        reset() {
          render(
            origins.map((r) => ({ ...r })),
            -1,
          );
        },
      };
      return () => {
        disposed = true;
        controls.current = null;
        observer.disconnect();
        cards.forEach((card) => gsap.killTweensOf(card));
        drags.forEach((d) => d.kill());
      };
    },
    { scope: board },
  );
  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
      ArrowUp: [0, -16],
      ArrowDown: [0, 16],
      Home: [0, 0],
    };
    if (!delta[event.key]) return;
    event.preventDefault();
    const [x, y] = delta[event.key];
    controls.current?.move(
      Number(event.currentTarget.dataset.word),
      x,
      y,
      event.key === "Home",
    );
  };
  return (
    <section id="process" className={s.process}>
      <Chapter n="02">CARA KAMI BERTUMBUH</Chapter>
      <p className={s.srOnly} id="drag-help">
        Geser kata, atau gunakan tombol panah. Enter untuk membalik. Home untuk
        mengembalikan posisi.
      </p>
      <div ref={board} className={s.wordBoard}>
        {words.map((word, i) => (
          <Fragment key={word}>
            <button
              data-word={i}
              className={s.word}
              style={
                {
                  "--accent": colors[(i + 1) % 4],
                  "--tilt": `${[0, 2, -2, 1, -1][i % 5]}deg`,
                } as CSSProperties
              }
              aria-describedby="drag-help"
              aria-pressed={flipped === i}
              aria-label={flipped === i ? meanings[i] : word}
              onKeyDown={move}
              onClick={(e) => {
                if (
                  e.detail &&
                  (Draggable.get(e.currentTarget)?.timeSinceDrag() ?? 1) < 0.2
                )
                  return;
                setFlipped(flipped === i ? null : i);
              }}
            >
              <span className={s.wordInner} data-flipped={flipped === i}>
                <span className={s.wordFront}>
                  {word}
                  <i>
                    <Shape type={i} />
                  </i>
                </span>
                <span className={s.wordBack}>{meanings[i]}</span>
              </span>
              {i === 4 && (
                <small className={s.dragHint}>Geser aku, coba saja</small>
              )}
            </button>
            {[1, 4, 7].includes(i) && (
              <span className={s.wordBreak} aria-hidden="true" />
            )}
          </Fragment>
        ))}
      </div>
      <button
        className={s.resetWords}
        onClick={() => {
          controls.current?.reset();
          setFlipped(null);
        }}
      >
        <RotateCcw size={15} /> Kembalikan susunan
      </button>
    </section>
  );
}

function CraftCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const turn = (value: boolean) =>
    contextSafe(() => {
      setOpen(value);
      gsap.to(root.current!.firstElementChild, {
        rotationY: value ? 180 : 0,
        duration: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.65,
        ease: "power2.inOut",
        overwrite: true,
      });
    })();
  return (
    <button
      ref={root}
      className={s.craft}
      style={{ "--accent": colors[index % 4] } as CSSProperties}
      aria-expanded={open}
      aria-label={`${title}. ${open ? description : "Lihat detail"}`}
      onClick={() => turn(!open)}
      onMouseEnter={() => {
        if (matchMedia("(hover:hover)").matches) turn(true);
      }}
      onMouseLeave={() => turn(false)}
    >
      <span className={s.craftInner}>
        <span className={s.craftFront}>
          <strong>{title}</strong>
          <Shape type={[3, 1, 4, 2][index % 4]} />
        </span>
        <span className={s.craftBack}>
          <strong>{title}</strong>
          <span>{description}</span>
          <ArrowRight />
        </span>
      </span>
    </button>
  );
}

function videoSource(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    const host = parsed.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? parsed.pathname.slice(1)
        : ["youtube.com", "m.youtube.com"].includes(host)
          ? parsed.searchParams.get("v") ||
            parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
          : null;
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id))
      return {
        kind: "embed",
        url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
      };
    if (/\.mp4$/i.test(parsed.pathname)) return { kind: "video", url };
  } catch {
    return null;
  }
  return null;
}

export default function ReplicaHome() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuTransition = useRef<gsap.core.Timeline | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const articleTrack = useRef<HTMLDivElement>(null);
  const [menuPhase, setMenuPhase] = useState<"closed" | "open" | "closing">(
    "closed",
  );
  const menuOpen = menuPhase !== "closed";
  const afterMenu = useRef<(() => void) | null>(null);
  const router = useRouter();
  const closeMenu = useCallback((after?: () => void) => {
    afterMenu.current = after ?? null;
    setMenuPhase("closing");
  }, []);
  const [dark, setDark] = useState(false);
  const [dialog, setDialog] = useState<string | null>(null);
  const [articleNav, setArticleNav] = useState({ prev: false, next: false });
  const { data: home } = useHomePage();
  const { data: settings } = useSiteSettings();
  const { data: activities = [], isLoading: loadingActivities } =
    useAktivitas();
  const { data: achievements = [], isLoading: loadingAchievements } =
    usePrestasi();

  const video = videoSource(home?.companyVideoUrl);
  const partners = home?.partners ?? [];
  const socials = [
    ["Instagram", settings?.instagramUrl],
    ["YouTube", settings?.youtubeUrl],
  ].filter((entry): entry is [string, string] =>
    Boolean(entry[1]?.startsWith("https://")),
  );

  useEffect(() => {
    const stored = localStorage.getItem("sr-theme");
    // Apply after hydration; the server and initial client both use the light palette.
    const frame = requestAnimationFrame(() => setDark(stored === "dark"));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    panel.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
      if (e.key !== "Tab") return;
      const focusables = [
        menuButton.current,
        root.current?.querySelector<HTMLElement>("[data-menu-logo] button"),
        ...Array.from(
          panel.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
        ),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0],
        last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      smoother?.paused(false);
      document.removeEventListener("keydown", key);
    };
  }, [menuOpen, closeMenu]);
  useEffect(() => {
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    modal.current?.showModal();
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      smoother?.paused(false);
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, [dialog]);
  useGSAP(
    () => {
      if (!menuOpen || !panel.current) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const backdrop = root.current!.querySelector("[data-menu-backdrop]");
      const logo = root.current!.querySelector("[data-menu-logo]");
      const links = panel.current.querySelectorAll("nav a");
      menuTransition.current?.kill();
      gsap.killTweensOf([panel.current, backdrop, logo, ...links]);
      if (menuPhase === "closing") {
        menuTransition.current = gsap
          .timeline({
            onComplete: () => {
              setMenuPhase("closed");
              menuButton.current?.focus({ preventScroll: true });
              const after = afterMenu.current;
              afterMenu.current = null;
              if (after) requestAnimationFrame(after);
            },
          })
          .to(
            links,
            {
              y: -15,
              opacity: 0,
              stagger: reduced ? 0 : { each: 0.025, from: "end" },
              duration: reduced ? 0 : 0.2,
            },
            0,
          )
          .to(
            logo,
            { autoAlpha: 0, scale: 0.85, y: 18, duration: reduced ? 0 : 0.3 },
            0,
          )
          .to(
            panel.current,
            {
              xPercent: 105,
              duration: reduced ? 0 : 0.55,
              ease: "power3.inOut",
            },
            reduced ? 0 : 0.1,
          )
          .to(
            backdrop,
            { opacity: 0, duration: reduced ? 0 : 0.4 },
            reduced ? 0 : 0.15,
          );
        return;
      }
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: reduced ? 0 : 0.45 },
      );
      gsap.fromTo(
        panel.current,
        { xPercent: 105 },
        {
          xPercent: 0,
          duration: reduced ? 0 : 0.65,
          ease: "power3.inOut",
        },
      );
      gsap.fromTo(
        panel.current.querySelectorAll("nav a"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.045,
          duration: reduced ? 0 : 0.55,
          delay: reduced ? 0 : 0.2,
        },
      );
      if (!reduced) {
        gsap
          .timeline()
          .fromTo(
            "[data-menu-logo]",
            {
              autoAlpha: 0,
              scale: 0.85,
              y: 24,
            },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              delay: 0.15,
              ease: "power3.out",
            },
          )
          .to("[data-menu-logo]", {
            y: -10,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
      }
    },
    { scope: root, dependencies: [menuPhase] },
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-shape]", {
          scale: 0,
          rotation: -55,
          stagger: 0.08,
          duration: 1.3,
          ease: "back.out(1.5)",
          delay: 0.2,
        });
        gsap.to("[data-float]", {
          y: -14,
          rotation: 5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-spin]", {
          rotation: 360,
          duration: 22,
          repeat: -1,
          ease: "none",
        });
        gsap.to("[data-marquee]", {
          xPercent: -50,
          duration: 28,
          repeat: -1,
          ease: "none",
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    const track = articleTrack.current;
    if (!track) return;
    const update = () =>
      setArticleNav({
        prev: track.scrollLeft > 2,
        next: track.scrollLeft < track.scrollWidth - track.clientWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    update();
    return () => observer.disconnect();
  }, [activities.length]);
  const closeDialog = () => {
    modal.current?.close();
    setDialog(null);
  };
  const scrollArticles = (direction: number) => {
    const track = articleTrack.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.72,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <div ref={root} className={s.site} data-theme={dark ? "dark" : "light"}>
      <a href="#main-content" className={s.skip}>
        Lewati ke konten
      </a>
      <header className={s.header}>
        <Link href="/" className={s.brand}>
          <Image src="/logo.png" alt="Logo SR" width={32} height={36} />
          <span>
            <b>SR</b>
            <small>Seni Religi</small>
          </span>
        </Link>
        <div className={s.headerControls}>
          <Image
            className={s.controlLogo}
            src="/logo.png"
            alt="Seni Religi UB"
            width={27}
            height={30}
          />
          <button
            className={s.theme}
            aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
            onClick={() => {
              setDark(!dark);
              localStorage.setItem("sr-theme", dark ? "light" : "dark");
            }}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            ref={menuButton}
            className={s.menuButton}
            aria-expanded={menuOpen}
            aria-controls="site-nav-panel"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => {
              if (menuPhase === "open") closeMenu();
              else {
                afterMenu.current = null;
                setMenuPhase("open");
              }
            }}
          >
            {menuOpen ? "CLOSE" : "MENU"}
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <>
            <div data-menu-backdrop className={s.backdrop}>
              <button
                className={s.backdropClose}
                aria-label="Tutup latar menu"
                tabIndex={-1}
                onClick={() => closeMenu()}
              />
              <span className={s.menuLogoStage}>
                <span className={s.menuLogo} data-menu-logo>
                  <MotionPiece kind="logo" label="Putar logo SR di menu">
                    <Image src="/logo.png" alt="" width={260} height={260} />
                  </MotionPiece>
                </span>
              </span>
            </div>
            <aside
              id="site-nav-panel"
              ref={panel}
              className={s.panel}
              aria-label="Menu utama"
            >
              <span className={s.menuLabel}>MENU</span>
              <nav>
                {navigation.map(([label, href], i) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      closeMenu(() => router.push(href));
                    }}
                  >
                    <small>0{i + 1}</small>
                    {label}
                  </Link>
                ))}
              </nav>
              <div className={s.panelBottom}>
                <small>MARI TERHUBUNG</small>
                <Link
                  href="/kontak"
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    closeMenu(() => router.push("/kontak"));
                  }}
                >
                  {settings?.email?.includes("@")
                    ? settings.email
                    : "Sapa Seni Religi"}
                  <Plus size={17} />
                </Link>
                <small>SOSIAL</small>
                <div>
                  {socials.map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noreferrer">
                      {name} ↗
                    </a>
                  ))}
                </div>
                <div className={s.panelLegal}>
                  <span>Malang (ID)</span>
                  <button
                    onClick={() => {
                      closeMenu(() => setDialog("privacy"));
                    }}
                  >
                    Privasi
                  </button>
                  <button
                    onClick={() => {
                      closeMenu(() => setDialog("terms"));
                    }}
                  >
                    Ketentuan
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}
      </header>
      <GsapStage compact>
        <main id="main-content" tabIndex={-1}>
          <section
            className={s.hero}
            data-sr-hero
            aria-label="Seni Religi Universitas Brawijaya"
          >
            <h1 className={s.srOnly}>Seni Religi Universitas Brawijaya</h1>
            <HeroPointerTrail />
            <i className={`${s.confetti} ${s.c1}`} data-hero-label data-float />
            <i className={`${s.confetti} ${s.c2}`} data-float />
            <span className={`${s.confetti} ${s.c3}`} data-spin>
              +
            </span>
            <i className={`${s.confetti} ${s.c4}`} data-float />
            <div className={s.composition}>
              <div className={s.rowOne}>
                <MotionPiece
                  kind="text"
                  label="Animasikan Seni"
                  className={s.heroText}
                >
                  <span data-hero-line>Seni,</span>
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="square"
                  label="Putar persegi hijau"
                  className={s.square}
                >
                  {null}
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="toggle"
                  label="Geser sakelar warna"
                  className={s.pill}
                >
                  <i />
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="triangle"
                  label="Putar segitiga biru"
                  className={s.triangle}
                >
                  {null}
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="bounce"
                  label="Pantulkan lingkaran kuning"
                  className={s.circle}
                >
                  {null}
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="cross"
                  label="Putar tanda silang"
                  className={s.cross}
                >
                  <X />
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="burst"
                  label="Pecahkan lingkaran merah"
                  className={s.redCircle}
                >
                  {null}
                </MotionPiece>
              </div>
              <div className={s.rowTwo}>
                <div className={s.arrowSpace} />
                <MotionPiece
                  hero
                  kind="leaves"
                  label="Putar kelopak biru"
                  className={s.petals}
                >
                  <Shape type={2} />
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="star"
                  label="Putar bintang merah"
                  className={s.star}
                >
                  <Shape type={0} />
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="hourglass"
                  label="Balik jam pasir"
                  className={s.hourglass}
                >
                  <Shape type={5} />
                </MotionPiece>
                <MotionPiece
                  kind="text"
                  label="Animasikan Religi"
                  className={s.heroText}
                >
                  <span data-hero-line>Religi,</span>
                </MotionPiece>
                <i className={s.dot} />
              </div>
              <div className={s.rowThree}>
                <svg
                  className={s.loopArrow}
                  viewBox="0 0 460 180"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    data-arch-line
                    d="M450 10H40Q10 10 10 40V120Q10 150 40 150H245M230 135l16 15-16 15"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <MotionPiece
                  kind="text"
                  label="Animasikan Universitas Brawijaya"
                  className={s.heroText}
                >
                  <span data-hero-line>&amp; Universitas Brawijaya</span>
                </MotionPiece>
                <MotionPiece
                  hero
                  kind="logo"
                  label="Putar logo SR di hero"
                  className={s.heroLogo}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo Seni Religi"
                    width={108}
                    height={120}
                    priority
                  />
                </MotionPiece>
              </div>
            </div>
            <div className={s.heroBottom} data-hero-detail>
              <a href="#projects" className={s.rainbowButton}>
                <span className={s.ctaLabel}>
                  <span>Lihat karya kami</span>
                  <span aria-hidden="true">Lihat karya kami</span>
                </span>{" "}
                <ArrowRight size={16} />
              </a>
              <a href="#process" className={s.scroll}>
                Scroll
                <ArrowDown size={17} />
              </a>
            </div>
          </section>
          <Process />
          <section id="reel" className={s.reel}>
            <div className={s.reelHeading}>
              <Chapter n="03">KENALI SENI RELIGI</Chapter>
              <h2>
                <span className={s.reelFirst} data-reveal>
                  Dari Hati,
                </span>
                <span data-reveal>Menjadi Karya.</span>
              </h2>
            </div>
            <div className={s.aboutCopy}>
              <p>
                Kami adalah keluarga Seni Religi Universitas Brawijaya. Ruang
                untuk belajar, mengekspresikan diri, dan merawat nilai melalui
                seni. Dari harmoni suara hingga keindahan aksara, kami bertumbuh
                dan berkarya bersama.
              </p>
              <Link className={s.storyButton} href="/tentang">
                <i /> CERITA KAMI
              </Link>
            </div>
            <div className={s.reelPin} data-reel-pin>
              <button
                className={s.videoFrame}
                data-video-frame
                onClick={() => setDialog("video")}
                aria-label="Putar video company profile SR"
              >
                <Image
                  src={home?.companyVideoPosterUrl || IMAGES.stage}
                  alt="Company profile Seni Religi"
                  fill
                  sizes="90vw"
                  className={s.videoPoster}
                />
                <span className={s.videoShade} />
                <small className={s.coordinates}>
                  <i /> MALANG · UNIVERSITAS BRAWIJAYA
                </small>
                <span className={s.playLabel}>
                  PLAY{" "}
                  <i>
                    <Play fill="currentColor" size={23} />
                  </i>{" "}
                  VIDEO
                </span>
                <small className={s.videoCaption}>
                  SENI RELIGI — COMPANY PROFILE
                </small>
              </button>
            </div>
          </section>
          <section id="projects" className={`${s.section} ${s.projects}`}>
            <Chapter n="04">YANG KAMI CIPTAKAN</Chapter>
            <div className={s.sectionHead}>
              <div>
                <h2 data-split>Karya pilihan</h2>
                <p>
                  Ekspresi, proses, dan cerita yang tumbuh bersama Seni Religi.
                </p>
              </div>
              <More href="/galeri">Semua karya</More>
            </div>
            <div className={s.projectGrid}>
              {[
                {
                  title: "Harmoni dalam kebersamaan",
                  tag: "BANJARI & NASYID",
                  img: IMAGES.stage,
                  href: "/tentang/bidang/banjari-nasyid",
                },
                {
                  title: "Keindahan dalam setiap aksara",
                  tag: "SENI KALIGRAFI",
                  img: IMAGES.calligraphy,
                  href: "/katalog",
                },
                {
                  title: "Ruang ekspresi, ruang bertumbuh",
                  tag: "GALERI SENI RELIGI",
                  img: IMAGES.community,
                  href: "/galeri",
                },
                {
                  title: "Merawat nilai melalui karya",
                  tag: "TILAWAH & TARTIL",
                  img: IMAGES.quran,
                  href: "/tentang/bidang/ttq",
                },
              ].map((item, i) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={s.projectCard}
                  data-reveal
                >
                  <div className={s.projectImage}>
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width:700px) 90vw, 45vw"
                    />
                    <span className={s.projectArrow}>
                      <ArrowRight />
                    </span>
                  </div>
                  <small>
                    {item.tag} <span>0{i + 1}</span>
                  </small>
                  <h3>{item.title}</h3>
                </Link>
              ))}
            </div>
          </section>
          <section id="crafts" className={s.section}>
            <Chapter n="05">RUANG KAMI BERKARYA</Chapter>
            <h2 data-split>Banyak bakat, satu rumah</h2>
            <p className={s.intro}>
              Suara, aksara, pengetahuan, dan gagasan. Temukan ruang ekspresimu.
              <br />
              Arahkan kursor atau ketuk kartu untuk mengenalnya lebih dekat.
            </p>
            <div className={s.crafts}>
              {[
                {
                  title: "Seni Suara & Musik",
                  description:
                    "Banjari, Nasyid, Tilawah, dan Tartil. Menyampaikan nilai melalui harmoni dan keindahan suara.",
                },
                {
                  title: "Seni Kaligrafi",
                  description:
                    "Khattil Qur’an. Merawat keindahan aksara, dari proses belajar hingga menjadi karya.",
                },
                {
                  title: "Al-Qur’an & Dakwah",
                  description:
                    "Hifdzil, Fahmil, dan Syarhil Qur’an. Belajar, memahami, serta menyampaikan pesan kebaikan.",
                },
                {
                  title: "Gagasan & Inovasi",
                  description:
                    "Debat ilmiah, karya tulis, dan desain aplikasi Qur’ani. Mengembangkan ide menjadi karya bermakna.",
                },
              ].map((item, i) => (
                <CraftCard key={item.title} {...item} index={i} />
              ))}
            </div>
            <More href="/tentang">Kenali seluruh bidang</More>
          </section>
          <section className={s.section} id="partners">
            <Chapter n="06">TUMBUH BERSAMA</Chapter>
            <h2 data-split>Dalam lingkaran yang baik</h2>
            <p className={s.intro}>
              Berkarya bersama keluarga, komunitas, dan rekan kolaborasi.
              <br />
              Pertemuan yang membuka ruang untuk saling menginspirasi.
            </p>
            <div className={s.partners}>
              {partners.length ? (
                partners.map((p) => (
                  <a
                    key={p.name}
                    href={p.url || "/kontak"}
                    className={s.partner}
                  >
                    {p.logoUrl && (
                      <Image src={p.logoUrl} alt="" width={70} height={65} />
                    )}
                    <strong>{p.name}</strong>
                  </a>
                ))
              ) : (
                <>
                  <Link href="/tentang" className={s.partner}>
                    <Image src="/logo.png" alt="" width={62} height={68} />
                    <span>
                      <b>SENI RELIGI</b>
                      <small>Universitas Brawijaya</small>
                    </span>
                  </Link>
                  <span className={s.partnerWord}>
                    Universitas
                    <br />
                    <b>Brawijaya</b>
                  </span>
                  <Link href="/kontak" className={s.partnerInvite}>
                    <Plus />
                    Ruang untuk
                    <br />
                    kolaborasi berikutnya
                  </Link>
                </>
              )}
            </div>
          </section>
          <section className={s.section} id="publications">
            <Chapter n="07">JEJAK PERJALANAN</Chapter>
            <div className={s.sectionHead}>
              <div>
                <h2 data-split>Tercatat dalam karya</h2>
                <p>
                  Prestasi dan pencapaian keluarga Seni Religi. Setiap langkah
                  punya cerita.
                </p>
              </div>
              <More href="/prestasi">Semua prestasi</More>
            </div>
            <div
              className={s.records}
              tabIndex={0}
              aria-label="Daftar prestasi yang dapat digulir"
            >
              {achievements.length ? (
                achievements.map((a) => (
                  <Link href="/prestasi" key={a._id} className={s.record}>
                    <span>
                      <small>
                        {a.category} · {a.level}
                      </small>
                      <strong>{a.title}</strong>
                      <span>{a.organizer}</span>
                    </span>
                    <small>{a.year}</small>
                  </Link>
                ))
              ) : (
                <div className={s.empty}>
                  {loadingAchievements
                    ? "Memuat perjalanan prestasi…"
                    : "Catatan prestasi akan ditampilkan di sini setelah dipublikasikan."}
                  <More href="/prestasi">Jelajahi prestasi SR</More>
                </div>
              )}
            </div>
          </section>
          <section className={s.section} id="articles">
            <Chapter n="08">CERITA DARI KAMI</Chapter>
            <div className={s.sectionHead}>
              <div>
                <h2 data-split>Catatan Seni Religi</h2>
                <p>
                  Cerita kegiatan, proses kreatif, dan hal-hal yang kami
                  pelajari bersama.
                </p>
              </div>
              <div className={s.articleActions}>
                <More href="/aktivitas">Semua aktivitas</More>
                <button
                  aria-label="Artikel sebelumnya"
                  disabled={!articleNav.prev}
                  onClick={() => scrollArticles(-1)}
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  aria-label="Artikel berikutnya"
                  disabled={!articleNav.next}
                  onClick={() => scrollArticles(1)}
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
            <div
              ref={articleTrack}
              className={s.articleTrack}
              onScroll={(e) => {
                const el = e.currentTarget;
                setArticleNav({
                  prev: el.scrollLeft > 2,
                  next: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
                });
              }}
            >
              {activities.length ? (
                activities.map((a) => (
                  <Link
                    key={a._id}
                    className={s.article}
                    href={`/aktivitas/${a.slug}`}
                  >
                    <div>
                      <Image
                        src={a.imageUrl || IMAGES.writing}
                        alt={a.title}
                        fill
                        sizes="(max-width:700px) 75vw, 30vw"
                      />
                    </div>
                    <small>{a.category}</small>
                    <h3>{a.title}</h3>
                  </Link>
                ))
              ) : (
                <p>
                  {loadingActivities
                    ? "Memuat cerita…"
                    : "Cerita terbaru akan segera hadir."}
                </p>
              )}
            </div>
          </section>
        </main>
        <footer className={s.footer}>
          <section className={s.finale}>
            <div>
              <Chapter n="09">SEKARANG GILIRANMU</Chapter>
              <h2 data-split>
                Mari menyapa <span>lebih dekat</span>
              </h2>
              <p>
                Punya ide, ingin berkarya, atau ingin mengenal kami?
                <br />
                Ceritakan pada kami. Kami senang mendengarnya.
              </p>
              <div className={s.finaleLinks}>
                <Link href="/kontak" className={s.contactButton}>
                  <i />
                  Hubungi kami
                </Link>
                <Link href="/tentang">
                  Kenali keluarga SR <ArrowRight size={17} />
                </Link>
              </div>
            </div>
            <div className={s.floatingLogo} data-float>
              <MotionPiece kind="logo" label="Putar logo SR di footer">
                <Image
                  src="/logo.png"
                  alt="Seni Religi Universitas Brawijaya"
                  width={200}
                  height={220}
                />
              </MotionPiece>
              <i />
            </div>
          </section>
          <div className={s.footerInfo} data-reveal>
            <div>
              <Image src="/logo.png" alt="" width={34} height={38} />
              <h3>Seni Religi Universitas Brawijaya</h3>
              <p>
                Ruang untuk berekspresi. Bertumbuh dalam kebersamaan.
                <br />
                Dari hati, menjadi karya.
              </p>
            </div>
            <div>
              <small>LOKASI</small>
              <p>
                {settings?.alamat || "Universitas Brawijaya"}
                <br />
                Malang, Jawa Timur
                <br />
                Indonesia
              </p>
            </div>
            <div>
              <small>TERHUBUNG</small>
              <div className={s.socials}>
                {socials.length ? (
                  socials.map(([label, url]) => (
                    <a href={url} key={label} target="_blank" rel="noreferrer">
                      {label} ↗
                    </a>
                  ))
                ) : (
                  <Link href="/kontak">Kontak SR ↗</Link>
                )}
              </div>
            </div>
          </div>
          <div
            className={s.marquee}
            aria-label="Seni Religi Universitas Brawijaya"
          >
            <div data-marquee aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i}>
                  SENI RELIGI <X />
                </span>
              ))}
            </div>
          </div>
          <div className={s.legal}>
            <span>© 2026 Seni Religi Universitas Brawijaya.</span>
            <div>
              <button onClick={() => setDialog("privacy")}>
                Kebijakan Privasi
              </button>
              <button onClick={() => setDialog("terms")}>
                Ketentuan Penggunaan
              </button>
              <a href="#main-content" aria-label="Kembali ke atas">
                ↑
              </a>
            </div>
          </div>
        </footer>
      </GsapStage>
      {dialog && (
        <dialog
          ref={modal}
          className={s.dialog}
          onCancel={() => setDialog(null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className={s.dialogContent}>
            <button
              className={s.closeDialog}
              aria-label="Tutup dialog"
              onClick={closeDialog}
            >
              <X />
            </button>
            {dialog === "video" ? (
              <>
                {video ? (
                  video.kind === "embed" ? (
                    <iframe
                      title="Company profile Seni Religi"
                      src={video.url}
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video src={video.url} controls autoPlay playsInline />
                  )
                ) : (
                  <div className={s.videoEmpty}>
                    <Image
                      src="/logo.png"
                      alt="Seni Religi"
                      width={75}
                      height={85}
                    />
                    <h2>Company profile Seni Religi</h2>
                    <p>Video resmi belum ditambahkan.</p>
                    <p>Ruang ini siap untuk video company profile SR.</p>
                  </div>
                )}
              </>
            ) : (
              <div className={s.policy}>
                <h2>
                  {dialog === "privacy"
                    ? "Kebijakan Privasi"
                    : "Ketentuan Penggunaan"}
                </h2>
                <p>
                  {dialog === "privacy"
                    ? "Halaman ini merupakan preview pengembangan website Seni Religi. Pilihan tema disimpan di browser Anda. Video YouTube, jika diputar, dimuat melalui pemutar pihak ketiga."
                    : "Website ini menampilkan informasi, kegiatan, dan karya Seni Religi Universitas Brawijaya. Konten dalam preview masih dapat berubah selama pengembangan."}
                </p>
                <p>
                  Dokumen kebijakan resmi akan dilengkapi oleh pengelola SR
                  sebelum website dipublikasikan.
                </p>
                <Link href="/kontak">
                  Hubungi pengelola <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
