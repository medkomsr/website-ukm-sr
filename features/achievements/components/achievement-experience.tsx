"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { usePrestasiPage, usePrestasiMeta } from "@/hooks/content/use-prestasi";
import type { SanityPrestasi } from "@/sanity/types";
import MedalJourney from "@/features/achievements/components/medal-journey";
import PrestasiIntro from "@/features/achievements/components/prestasi-intro";
import AchievementFilters from "@/features/achievements/components/achievement-filters";
import h from "@/styles/experience.module.scss";
import AchievementDialog from "@/features/achievements/components/achievement-dialog";
import { SrSymbol } from "@/components/brand/art-symbol";
import ArchiveLoadMore from "@/components/ui/archive-load-more";
import { useMobileArchive } from "@/hooks/content/use-mobile-archive";
import ArchivePagination from "@/components/ui/archive-pagination";
import { useDebouncedSearch } from "@/hooks/content/use-debounced-search";
import s from "@/features/achievements/components/achievements.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Flip);
const twoDigits = (value: number) => String(value).padStart(2, "0");
const emptyAchievements: SanityPrestasi[] = [];

function TransitionSymbols({ placement }: { placement: "statement" | "hero" }) {
  const indices = placement === "statement" ? [0, 2] : [4, 5];
  return (
    <div
      className={`${s.transitionSymbols} ${placement === "statement" ? s.statementSymbols : s.heroSymbols}`}
      data-transition-symbols
      aria-hidden="true"
    >
      {indices.map((index) => (
        <span key={index} className={s.transitionSymbol} data-transition-symbol>
          <SrSymbol index={index} />
        </span>
      ))}
    </div>
  );
}

export default function AchievementExperience() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const snapshot = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const filterAnimation = useRef<gsap.core.Timeline | null>(null);
  const previousHeight = useRef(0);
  const { contextSafe } = useGSAP({ scope: root });
  const [filters, setFilters] = useState({
    year: "all",
    field: "all",
    category: "all",
    search: "",
  });
  const { year, field, category, search } = filters;
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedSearch(search);
  const mobile = useMobileArchive();
  const prestasi = usePrestasiPage({ ...filters, search: debouncedSearch, page }, mobile);
  const meta = usePrestasiMeta();
  const data = prestasi.data?.items ?? emptyAchievements;
  const isLoading = prestasi.isLoading;
  const isError = prestasi.isError || meta.isError;
  const pending = prestasi.isFetching || search !== debouncedSearch;
  const refetch = () => {
    void prestasi.refetch();
    void meta.refetch();
  };
  const totalRecords = meta.data?.total ?? 0;
  const [selection, setSelection] = useState<{
    item: SanityPrestasi;
    origin: HTMLButtonElement;
  } | null>(null);
  const years = [...(meta.data?.years ?? [])].sort((a, b) => b - a);
  const fields = meta.data?.fields ?? [];
  const categories = meta.data?.categories ?? [];
  const total = prestasi.data?.total ?? 0;
  const pages = prestasi.data?.pages ?? 1;
  const currentPage = prestasi.data?.page ?? page;
  const shown = new Set(data.map((item) => item._id));

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-line]", {
          yPercent: 85,
          opacity: 0,
          stagger: 0.14,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-hero-heading]", start: "top 85%", once: true },
        });
        gsap.from("[data-hero-meta]", {
          opacity: 0,
          y: 40,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-hero-meta]", start: "top bottom", once: true },
        });
        gsap.from("[data-statement-word]", {
          opacity: 0.16,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-statement]",
            start: "top 75%",
            end: "bottom 65%",
            scrub: true,
          },
        });
        gsap.utils
          .toArray<HTMLElement>("[data-transition-symbol]", root.current)
          .forEach((symbol, index) => {
            const direction = index % 2 ? -1 : 1;
            gsap.fromTo(
              symbol,
              { y: 18 * direction },
              {
                y: -18 * direction,
                ease: "none",
                scrollTrigger: {
                  trigger: symbol.parentElement!.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]", root.current).forEach((element) => {
          gsap.from(element, {
            y: 35,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-count]", root.current).forEach((element) => {
          const total = Math.min(10, Number(element.dataset.count));
          const counter = { value: 0 };
          gsap.to(counter, {
            value: total,
            duration: 1.7,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = twoDigits(Math.round(counter.value));
            },
            scrollTrigger: { trigger: element, start: "top 95%", once: true },
          });
        });
      });
      ScrollTrigger.refresh();
      return () => media.revert();
    },
    { scope: root, dependencies: [totalRecords], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const elements = results.current?.querySelectorAll("[data-result]");
      if (snapshot.current && elements?.length) {
        const state = snapshot.current;
        snapshot.current = null;
        const height = results.current!.getBoundingClientRect().height;
        const animation = Flip.from(state, {
          duration: 0.6,
          scale: true,
          ease: "power2.inOut",
          absoluteOnLeave: true,
          onEnter: (items) =>
            gsap.fromTo(
              items,
              { opacity: 0, scale: 0.88 },
              { opacity: 1, scale: 1, duration: 0.6 },
            ),
          onLeave: (items) => gsap.to(items, { opacity: 0, scale: 0.88, duration: 0.3 }),
          onComplete: () => {
            gsap.set(results.current, { clearProps: "height" });
            ScrollTrigger.refresh();
          },
        });
        animation.fromTo(
          results.current,
          { height: previousHeight.current },
          { height, duration: 0.6, ease: "power2.inOut" },
          0,
        );
        filterAnimation.current = animation;
      }
      ScrollTrigger.refresh();
    },
    {
      scope: root,
      dependencies: [data, year, field, category, search, page],
      revertOnUpdate: true,
    },
  );
  const changeFilters = (next: typeof filters) => {
    filterAnimation.current?.progress(1).kill();
    if (results.current && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
      previousHeight.current = results.current.getBoundingClientRect().height;
      snapshot.current = Flip.getState(results.current.querySelectorAll("[data-result]"));
    }
    setFilters(next);
    setPage(1);
  };
  const reset = () => changeFilters({ year: "all", field: "all", category: "all", search: "" });
  const explore = contextSafe(() => {
    gsap.to(window, {
      scrollTo: { y: window.scrollY + window.innerHeight * 0.85, autoKill: true },
      duration: matchMedia("(prefers-reduced-motion:reduce)").matches ? 0 : 1.25,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  });
  const spin = contextSafe((element: Element) => {
    gsap.to(element, {
      rotation: "+=180",
      duration: matchMedia("(prefers-reduced-motion:reduce)").matches ? 0 : 1.2,
      ease: "elastic.out(1,.55)",
      overwrite: true,
    });
  });
  const open = (item: SanityPrestasi, origin: HTMLButtonElement) => setSelection({ item, origin });
  return (
    <div ref={root} className={s.page}>
      <PrestasiIntro />
      <div ref={journey} className={s.journey}>
        <MedalJourney />
        <section
          ref={hero}
          className={s.hero}
          aria-labelledby="achievement-title"
          data-tone="green"
        >
          <TransitionSymbols placement="hero" />
          <h2 id="achievement-title" className={s.heroTitle} data-hero-heading>
            <span className={s.lineMask}>
              <span data-hero-line>MEMBAWA</span>
            </span>
            <span className={s.lineMask}>
              <span data-hero-line>
                <em>NAMA</em> BAIK.
              </span>
            </span>
            <span className={s.lineMask}>
              <span data-hero-line>
                MERAIH <em>PRESTASI.</em>
              </span>
            </span>
          </h2>
          <span data-medal-point className={s.heroMedalStart} />
          <span data-medal-point className={s.heroMedalHold} />
          <div className={s.heroBottom} data-hero-meta>
            <button
              type="button"
              onClick={explore}
              className={`${h.heroScroll} ${s.exploreButton}`}
            >
              <span>
                Jelajahi lebih lanjut <ArrowDown size={18} />
              </span>
            </button>
          </div>
        </section>

        <section className={s.statement} data-statement data-tone="green">
          <TransitionSymbols placement="statement" />
          <span data-medal-point className={s.statementMedalPoint} />
          <h2>
            {[
              "BERANGKAT",
              "DARI",
              "HATI.",
              "BERKARYA",
              "SEPENUH",
              "JIWA.",
              "MENGHARUMKAN",
              "ALMAMATER.",
            ].map((word, i) => (
              <span
                key={word}
                data-statement-word
                className={i === 2 || i === 5 || i === 7 ? s.serif : undefined}
              >
                {word}{" "}
              </span>
            ))}
          </h2>
        </section>

        <section className={s.records} aria-labelledby="records-title" data-tone="green">
          <span data-medal-point className={s.recordsMedalFirst} />
          <div className={s.recordsHeading} data-reveal>
            <h2 id="records-title">TRACK RECORD</h2>
          </div>
          <div className={s.recordTotal} data-reveal>
            <span className={s.bigNumber} data-compact={totalRecords > 10 || undefined}>
              <span data-count={totalRecords}>{twoDigits(Math.min(10, totalRecords))}</span>
              {totalRecords > 10 && <span className={s.countPlus}>+</span>}
            </span>
            <div>
              <button
                className={s.starButton}
                aria-label="Putar bintang prestasi"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") spin(event.currentTarget.firstElementChild!);
                }}
                onClick={(event) => spin(event.currentTarget.firstElementChild!)}
              >
                <span className={s.star}>✳</span>
              </button>
              <h3>
                PRESTASI
                <br />
                TERDOKUMENTASI
              </h3>
            </div>
          </div>
          <div className={s.medalDock} data-medal-stop aria-hidden="true">
            <span data-medal-point className={s.medalDockPoint} />
          </div>
        </section>
      </div>
      <section
        tabIndex={-1}
        id="rekam-prestasi"
        className={s.archive}
        aria-labelledby="archive-title"
        data-tone="cream"
      >
        <svg
          className={s.topWave}
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 90V62C360-70 880 120 1440 20V90Z" />
        </svg>
        <div className={s.archiveIntro} data-reveal>
          <h2 id="archive-title">ARSIP PRESTASI</h2>
        </div>
        <AchievementFilters
          values={filters}
          years={years}
          fields={fields}
          categories={categories}
          count={total}
          loading={pending}
          onChange={changeFilters}
        />
        <div className={s.resultLabels} aria-hidden="true">
          <span>TAHUN</span>
          <span>PRESTASI / KOMPETISI</span>
          <span>TINGKAT</span>
          <span>PENCAPAIAN</span>
          <span />
        </div>
        <div ref={results} className={s.results} aria-busy={pending} inert={pending}>
          {data.map((item) => (
            <button
              key={item._id}
              className={s.result}
              style={{ display: shown.has(item._id) ? undefined : "none" }}
              inert={!shown.has(item._id)}
              aria-hidden={!shown.has(item._id)}
              data-result
              onClick={(event) => open(item, event.currentTarget)}
              aria-label={`Lihat prestasi: ${item.title}`}
            >
              <span className={s.resultYear}>{item.year}</span>
              <span className={s.resultTitle}>
                <small>{item.field || item.category}</small>
                <strong>{item.title}</strong>
                {!!item.participants?.length && (
                  <span className={s.participantNames}>
                    {item.participants.map((person) => person.name).join(" · ")}
                  </span>
                )}
              </span>
              <span className={s.resultLevel}>{item.level}</span>
              <span className={s.resultPosition}>{item.position || item.category}</span>
              <span className={s.resultArrow}>
                <ArrowUpRight size={23} />
              </span>
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className={s.empty} role="status">
            <p>Menyiapkan jejak prestasi…</p>
          </div>
        ) : isError ? (
          <div className={s.empty} role="alert">
            <h3>Arsip belum dapat dimuat.</h3>
            <button className={s.pill} onClick={() => refetch()}>
              Coba lagi <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          !data.length && (
            <div className={s.empty}>
              <h3>
                {totalRecords ? "Belum ada hasil yang cocok." : "Jejak baik, segera hadir di sini."}
              </h3>
              <p>
                {totalRecords
                  ? "Coba pilihan tahun atau bidang lainnya."
                  : "Arsip pencapaian dan kisah para juara sedang dirangkai."}
              </p>
              {totalRecords ? (
                <button className={s.pill} onClick={reset}>
                  Lihat semua prestasi <X size={16} />
                </button>
              ) : (
                <Link href="/aktivitas" className={`${h.heroScroll} ${s.exploreButton}`}>
                  <span>
                    Jelajahi berita & acara <ArrowUpRight size={18} />
                  </span>
                </Link>
              )}
            </div>
          )
        )}
        {mobile ? (
          <ArchiveLoadMore
            busy={pending}
            canExpand={prestasi.canExpand}
            canCollapse={prestasi.canCollapse}
            onMore={() => void prestasi.loadMore()}
            onLess={prestasi.collapse}
          />
        ) : (
          <ArchivePagination
            page={currentPage}
            pages={pages}
            busy={pending}
            onChange={(next) => {
              setPage(next);
              root.current
                ?.querySelector("#rekam-prestasi")
                ?.scrollIntoView({ behavior: "instant", block: "start" });
            }}
          />
        )}
      </section>

      <section className={s.champions} aria-labelledby="champions-title" data-tone="green">
        <svg
          className={s.championsWave}
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 90V62C360-70 880 120 1440 20V90Z" />
        </svg>
        <div className={s.championsIntro} data-reveal>
          <h2 id="champions-title">
            NAMA MEREKA.
            <br />
            <em>KEBANGGAAN KITA.</em>
          </h2>
          <p>
            Untuk setiap usaha yang tak terlihat.
            <br />
            Untuk setiap nama yang membawa Seni Religi lebih jauh.
          </p>
        </div>
        <div className={s.appreciation} data-reveal>
          <span className={s.script}>Terima kasih,</span>
          <p>
            kepada setiap insan Seni Religi yang berlatih,
            <br />
            berjuang, dan memberikan yang terbaik.
          </p>
        </div>
      </section>

      <AchievementDialog selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}
