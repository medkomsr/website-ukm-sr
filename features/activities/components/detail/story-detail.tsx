"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight } from "lucide-react";
import { PortableText } from "next-sanity";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAktivitasBySlug } from "@/hooks/content/use-aktivitas";
import type { SanityActivity } from "@/sanity/types";
import { srFields } from "@/lib/constants/art-fields";
import DocumentationCollage from "@/features/art-fields/components/documentation-collage";
import { SrSymbol } from "@/components/brand/art-symbol";
import s from "@/features/activities/components/detail/story-detail.module.scss";

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger);

function Rosette() {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx="35"
            ry="86"
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="91" />
      </g>
    </svg>
  );
}

const emblemPositions = [
  [12, 19, -12],
  [23, 39, 9],
  [9, 60, -8],
  [22, 80, 12],
  [83, 16, 10],
  [76, 38, -12],
  [90, 54, 8],
  [78, 76, -9],
  [91, 86, 8],
];

function HeroEmblems() {
  return (
    <div className={s.emblems} aria-hidden="true">
      {[...srFields, { name: "Seni Religi", slug: "" }].map((field, index) => {
        const [left, top, tilt] = emblemPositions[index];
        return (
          <div
            key={field.name}
            data-hero-emblem
            data-side={index < 4 ? "left" : "right"}
            className={s.emblem}
            style={
              {
                "--emblem-x": `${left}%`,
                "--emblem-y": `${top}%`,
                "--column": index % 4,
                "--tilt": `${tilt}deg`,
                "--delay": `${0.15 + index * 0.07}s`,
                "--float-duration": `${4.5 + (index % 4) * 0.65}s`,
                "--float-delay": `${-index * 0.6}s`,
              } as CSSProperties
            }
          >
            <div className={s.emblemEntrance}>
              <div className={s.emblemFloat}>
                <div className={s.emblemVisual}>
                  {field.slug ? (
                    <SrSymbol index={index} />
                  ) : (
                    <Image src="/logo.png" alt="" width={80} height={90} className={s.srLogo} />
                  )}
                  <span className={s.emblemLabel}>{field.name}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Experience({ activity }: { activity: SanityActivity }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const heroPin = useRef<HTMLDivElement>(null);
  const bento = useRef<HTMLDivElement>(null);
  const photos = [
    ...(activity.imageUrl
      ? [
          {
            _key: "cover",
            imageUrl: activity.imageUrl,
            alt: activity.title,
            caption: activity.title,
          },
        ]
      : []),
    ...(activity.gallery || []).filter((photo) => photo.imageUrl),
  ];

  useGSAP(
    (_, contextSafe) => {
      let disposed = false;
      let layout: gsap.Context | undefined;
      let resizeTimer: ReturnType<typeof setTimeout>;
      const media = gsap.matchMedia();
      const start = contextSafe!(() => {
        if (disposed) return;
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const createLayout = () => {
            layout?.revert();
            const gallery = bento.current!;
            const cells = gallery.querySelectorAll<HTMLElement>("[data-bento-cell]");
            // Flip leaves measured dimensions inline; rebuild from the responsive CSS.
            gsap.set(cells, { clearProps: "all" });
            gsap.set(gallery.querySelector("[data-cover-title]"), { clearProps: "fontSize" });
            gallery.classList.remove(s.bentoFinal);
            layout = gsap.context(() => {
              gallery.classList.add(s.bentoFinal);
              const finalState = Flip.getState(cells, { props: "borderRadius" });
              gallery.classList.remove(s.bentoFinal);
              const zoom = gsap.timeline({
                scrollTrigger: {
                  trigger: heroPin.current,
                  start: "top 64px",
                  end: () => `+=${Math.max(550, innerHeight * 1.15)}`,
                  pin: heroPin.current,
                  scrub: 0.75,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              zoom.add(Flip.to(finalState, { duration: 1, ease: "power2.inOut", simple: true }));
              zoom.to(
                gallery.querySelector("[data-cover-title]"),
                {
                  fontSize: () => `${Math.min(112, innerWidth * 0.085)}px`,
                  duration: 0.85,
                  ease: "power2.inOut",
                },
                0.1,
              );
              zoom.to(
                gallery.querySelector("[data-scroll-cue]"),
                { autoAlpha: 0, duration: 0.15 },
                0,
              );
              zoom.to(
                frame.current!.querySelectorAll("[data-hero-emblem]"),
                {
                  autoAlpha: 0,
                  scale: 0.65,
                  x: (_, element) =>
                    innerWidth <= 700 ? 0 : element.dataset.side === "left" ? -65 : 65,
                  y: (_, element) =>
                    innerWidth <= 700 ? (element.dataset.side === "left" ? -45 : 45) : -22,
                  duration: 0.3,
                  stagger: 0.012,
                  ease: "power2.in",
                },
                0,
              );
              zoom.to({}, { duration: 0.15 });

              return () => {
                gsap.set(cells, { clearProps: "all" });
              };
            }, root);
            ScrollTrigger.refresh();
          };
          createLayout();
          let width = innerWidth;
          let height = innerHeight;
          const resize = () => {
            if (width === innerWidth && (innerWidth <= 700 || height === innerHeight)) return;
            width = innerWidth;
            height = innerHeight;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(createLayout, 160);
          };
          window.addEventListener("resize", resize);
          const reveals = gsap.utils.toArray<HTMLElement>("[data-story-reveal]", root.current!);
          reveals.forEach((element) =>
            gsap.from(element, {
              y: 28,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            }),
          );
          return () => {
            window.removeEventListener("resize", resize);
            clearTimeout(resizeTimer);
            layout?.revert();
          };
        });
      });
      document.fonts.ready.then(start);
      return () => {
        disposed = true;
        clearTimeout(resizeTimer);
        media.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={s.page} data-tone="green">
      <div ref={heroPin} className={s.heroPin}>
        <div ref={frame} className={s.frame} aria-label="Foto utama berita dan acara">
          <HeroEmblems />
          <div ref={bento} className={s.bento}>
            <div data-bento-cell className={`${s.cell} ${s.lead}`}>
              <div className={s.leadVisual}>
                {activity.imageUrl ? (
                  <Image
                    src={activity.imageUrl}
                    alt={activity.title}
                    fill
                    sizes="100vw"
                    loading="eager"
                    className={s.cover}
                  />
                ) : (
                  <div className={s.coverFallback}>
                    <Rosette />
                  </div>
                )}
                <div className={s.coverShade} />
                <div className={s.coverText}>
                  <p>{activity.category}</p>
                  <h1 data-cover-title>{activity.title}</h1>
                </div>
              </div>
            </div>
            <span data-scroll-cue className={s.scrollCue}>
              Gulir untuk membaca <ArrowDown size={16} />
            </span>
          </div>
        </div>
      </div>

      <section
        id="isi-cerita"
        className={s.article}
        data-tone="green"
        aria-label="Isi berita dan acara"
      >
        <div className={s.prose}>
          <h2 data-story-reveal>{activity.title}</h2>
          <p className={s.standfirst} data-story-reveal>
            {activity.longDescription || activity.description}
          </p>
          {activity.body?.length ? (
            <div data-story-reveal className={s.body}>
              <PortableText value={activity.body} />
            </div>
          ) : null}
          {!!activity.agenda?.length && (
            <div className={s.agenda} data-story-reveal>
              <h2>Rangkaian acara.</h2>
              <ol>
                {activity.agenda.map((row, index) => (
                  <li key={`${row.time}-${index}`}>
                    <span>{row.time}</span>
                    <p>{row.item}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {!!activity.tags?.length && (
            <div className={s.tags} data-story-reveal>
              {activity.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <DocumentationCollage name={activity.title} title="Dokumentasi" tone="cream" items={photos} />
    </div>
  );
}

export default function StoryDetail({ slug }: { slug: string }) {
  const { data: activity, isLoading, error, refetch } = useAktivitasBySlug(slug);
  if (isLoading)
    return (
      <div className={s.loading} role="status">
        <Rosette />
        <p>Memuat cerita…</p>
      </div>
    );
  if (error)
    return (
      <div className={s.loading} role="alert">
        <h1>Cerita belum dapat dimuat.</h1>
        <button onClick={() => refetch()}>
          Coba lagi <ArrowRight size={18} />
        </button>
      </div>
    );
  if (!activity) return notFound();
  return <Experience key={activity._id} activity={activity} />;
}
