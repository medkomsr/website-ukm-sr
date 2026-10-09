"use client";

import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDownRight, ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAktivitas } from "@/hooks/content/use-aktivitas";
import FilterSelect from "@/features/achievements/components/filter-select";
import FeaturedStories from "@/features/activities/components/featured-stories";
import NewsTitle from "@/features/activities/components/news-title";
import StoryImage from "@/features/activities/components/story-image";
import StoryPreview, {
  type PreviewSelection,
} from "@/features/activities/components/story-preview";
import s from "@/features/activities/components/newsroom.module.scss";

gsap.registerPlugin(Flip, ScrollTrigger);
const mobileQuery = "(max-width: 700px)";
const subscribeViewport = (notify: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;
const statuses: Record<string, string> = {
  upcoming: "Akan datang",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

export default function Newsroom() {
  const { data, isLoading, error, refetch } = useAktivitas();
  const grid = useRef<HTMLDivElement>(null);
  const resultsArea = useRef<HTMLDivElement>(null);
  const resultsContent = useRef<HTMLDivElement>(null);
  const archive = useRef<HTMLElement>(null);
  const [types, setTypes] = useState(["article", "event"]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const mobile = useSyncExternalStore(subscribeViewport, getMobileSnapshot, getServerSnapshot);
  const [page, setPage] = useState(1);
  const limit = mobile ? Infinity : page * 9;
  const [selection, setSelection] = useState<PreviewSelection | null>(null);
  const snapshot = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const gridHeight = useRef(0);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const activities = useMemo(() => (data || []).filter((item) => item.slug), [data]);
  const featured = useMemo(() => activities.slice(0, 5), [activities]);
  const categories = useMemo(
    () => [...new Set(activities.map((item) => item.category).filter(Boolean))],
    [activities],
  );
  const filtered = useMemo(
    () =>
      activities.filter(
        (item) =>
          types.includes(item.type) &&
          (category === "all" || item.category === category) &&
          (status === "all" || (item.type === "event" && item.status === status)) &&
          `${item.title} ${item.description || ""} ${item.category || ""}`
            .toLocaleLowerCase("id")
            .includes(search.trim().toLocaleLowerCase("id")),
      ),
    [activities, types, category, status, search],
  );
  const shown = new Set(filtered.slice(0, limit).map((item) => item._id));
  const hasFilters = types.length !== 2 || category !== "all" || status !== "all" || search !== "";

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 701px) and (prefers-reduced-motion: no-preference)", () => {
      const targets = Array.from(
        archive.current?.querySelectorAll<HTMLElement>("[data-archive-pop]") || [],
      ).filter((element) => !element.dataset.archiveRevealed && element.offsetParent !== null);
      gsap.set(targets, { autoAlpha: 0, y: 28, scale: 0.94, transformOrigin: "50% 100%" });
      ScrollTrigger.batch(targets, {
        start: "top 92%",
        once: true,
        onEnter: (elements) => {
          elements.forEach((element) => {
            (element as HTMLElement).dataset.archiveRevealed = "true";
          });
          gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.09,
            ease: "back.out(1.35)",
            overwrite: "auto",
          });
        },
      });
      return () => {
        gsap.killTweensOf(targets);
      };
    });
    media.add("(max-width: 700px) and (prefers-reduced-motion: no-preference)", () => {
      const targets = Array.from(
        archive.current?.querySelectorAll<HTMLElement>("[data-archive-pop]") || [],
      ).filter((element) => !element.dataset.archiveRevealed && element.offsetParent !== null);
      targets.forEach((element) =>
        gsap.fromTo(
          element,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
              onEnter: () => {
                element.dataset.archiveRevealed = "true";
              },
            },
          },
        ),
      );
    });
    return () => media.revert();
  }, [activities, filtered, expanded, limit]);

  function change(update: () => void, resetScroll = true) {
    const container = grid.current;
    const area = resultsArea.current;
    if (mobile) {
      animation.current?.progress(1).kill();
      snapshot.current = null;
      if (area) area.style.removeProperty("height");
      if (resetScroll) container?.scrollTo({ left: 0, behavior: "instant" });
      update();
      return;
    }
    if (container && area && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Capture the visible frame before finishing a previous filter transition.
      gridHeight.current = area.getBoundingClientRect().height;
      // GSAP supports soft capture, but its bundled FlipStateVars omits `kill`.
      const captureOptions: Flip.FlipStateVars & { kill: boolean } = { kill: false };
      snapshot.current = Flip.getState(
        container.querySelectorAll("[data-news-card]"),
        captureOptions,
      );
      animation.current?.progress(1).kill();
      area.style.height = `${gridHeight.current}px`;
      // Filtering owns card entry now; don't replay the viewport reveal as well.
      const reveals = container.querySelectorAll<HTMLElement>("[data-archive-pop]");
      gsap.killTweensOf(reveals);
      gsap.set(reveals, { clearProps: "opacity,visibility,transform" });
      reveals.forEach((element) => {
        element.dataset.archiveRevealed = "true";
      });
    }
    update();
  }
  const reset = () =>
    change(() => {
      setTypes(["article", "event"]);
      setCategory("all");
      setStatus("all");
      setSearch("");
      setPage(1);
    });

  useLayoutEffect(() => {
    const container = grid.current;
    const area = resultsArea.current;
    if (!container || !area || !resultsContent.current || !snapshot.current) {
      ScrollTrigger.refresh();
      return;
    }
    const state = snapshot.current;
    snapshot.current = null;
    const height = resultsContent.current.getBoundingClientRect().height;
    const timeline = Flip.from(state, {
      duration: 0.6,
      scale: true,
      ease: "power2.inOut",
      absoluteOnLeave: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.88, duration: 0.3, ease: "power2.in" }),
      onComplete: () => {
        gsap.set(area, { clearProps: "height" });
        ScrollTrigger.refresh();
      },
    });
    timeline.fromTo(
      area,
      { height: gridHeight.current },
      { height, duration: 0.6, ease: "power2.inOut" },
      0,
    );
    const empty = resultsContent.current.querySelector("[data-empty-results]");
    if (empty) timeline.fromTo(empty, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.3);
    animation.current = timeline;
    return () => {
      timeline.kill();
    };
  }, [types, category, status, search, limit, activities]);

  return (
    <div className={s.page}>
      <NewsTitle />
      {isLoading ? (
        <div className={s.loadingHero} role="status">
          Memuat kabar Seni Religi…
        </div>
      ) : error ? (
        <div className={s.message} role="alert">
          <h2>Kabar belum dapat dimuat.</h2>
          <p>Silakan coba kembali sebentar lagi.</p>
          <button onClick={() => refetch()}>
            Coba lagi <ArrowUpRight size={17} />
          </button>
        </div>
      ) : featured.length > 0 ? (
        <FeaturedStories key={featured.map((item) => item._id).join("-")} items={featured} />
      ) : (
        <div className={s.emptyHero} data-tone="green">
          <h2>
            Cerita berikutnya
            <br />
            segera hadir.
          </h2>
          <p>Berita dan acara Seni Religi akan ditampilkan di sini.</p>
        </div>
      )}

      <section
        ref={archive}
        id="semua-kabar"
        className={s.archive}
        data-tone="cream"
        aria-labelledby="archive-title"
      >
        <div data-archive-pop className={s.archiveHeading}>
          <h2 id="archive-title">Semua Berita &amp; Acara</h2>
        </div>
        <div className={s.toolbar}>
          <div className={s.tabs} role="group" aria-label="Jenis kabar">
            {[
              { value: "all", label: "Semua" },
              { value: "article", label: "Berita" },
              { value: "event", label: "Acara" },
            ].map((tag) => {
              const checked = tag.value === "all" ? types.length === 2 : types.includes(tag.value);
              return (
                <label data-archive-pop key={tag.value} className={s.tagButton}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      change(() => {
                        setTypes(
                          tag.value === "all"
                            ? event.target.checked
                              ? ["article", "event"]
                              : []
                            : event.target.checked
                              ? [...types, tag.value]
                              : types.filter((type) => type !== tag.value),
                        );
                        setStatus("all");
                        setPage(1);
                      })
                    }
                  />
                  <span>{tag.label}</span>
                  <span className={s.checked} aria-hidden="true">
                    {tag.label}
                  </span>
                </label>
              );
            })}
          </div>
          <div data-archive-pop className={s.search}>
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Cari berita atau acara"
              placeholder="Cari berita atau acara…"
              value={search}
              onChange={(event) =>
                change(() => {
                  setSearch(event.target.value);
                  setPage(1);
                })
              }
            />
            {search && (
              <button
                aria-label="Hapus pencarian"
                onClick={() =>
                  change(() => {
                    setSearch("");
                    setPage(1);
                  })
                }
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            data-archive-pop
            className={s.filterButton}
            aria-expanded={expanded}
            aria-controls="news-filters"
            onClick={() => setExpanded(!expanded)}
          >
            <SlidersHorizontal size={17} />
            Filter
          </button>
        </div>
        {expanded && (
          <div data-archive-pop id="news-filters" className={s.filters}>
            <FilterSelect
              label="Kategori"
              value={category}
              options={[
                { value: "all", label: "Semua kategori" },
                ...categories.map((name) => ({ value: name!, label: name! })),
              ]}
              onChange={(value) =>
                change(() => {
                  setCategory(value);
                  setPage(1);
                })
              }
            />
            {types.includes("event") && (
              <FilterSelect
                label="Status acara"
                value={status}
                options={[
                  { value: "all", label: "Semua status" },
                  ...Object.entries(statuses).map(([value, label]) => ({ value, label })),
                ]}
                onChange={(value) =>
                  change(() => {
                    setStatus(value);
                    setPage(1);
                  })
                }
              />
            )}
            {hasFilters && (
              <button className={s.reset} onClick={reset}>
                Reset filter <X size={14} />
              </button>
            )}
          </div>
        )}
        <div data-archive-pop className={s.results} aria-live="polite">
          {isLoading ? "Memuat kabar…" : `${filtered.length} kabar ditemukan`}
          {hasFilters && !expanded && (
            <button onClick={reset}>
              Reset filter <X size={12} />
            </button>
          )}
        </div>
        {shown.size > 1 && <p className={s.swipeHint}>Geser ke samping untuk melihat cerita</p>}
        <div ref={resultsArea} className={s.resultsArea}>
          <div ref={resultsContent}>
            <div
              ref={grid}
              className={s.grid}
              role={mobile ? "region" : undefined}
              aria-label={mobile ? "Daftar berita dan acara, geser ke samping" : undefined}
              tabIndex={mobile && shown.size > 0 ? 0 : undefined}
            >
              {activities.map((item) => (
                <article
                  data-news-card
                  className={s.card}
                  key={item._id}
                  style={{ display: shown.has(item._id) ? "block" : "none" }}
                  inert={!shown.has(item._id)}
                  aria-hidden={!shown.has(item._id)}
                >
                  <div data-archive-pop>
                    <button
                      className={s.cardButton}
                      style={{
                        visibility: selection?.item._id === item._id ? "hidden" : undefined,
                      }}
                      aria-label={`Pratinjau: ${item.title}`}
                      aria-haspopup="dialog"
                      onClick={(event) => {
                        const origin = event.currentTarget;
                        animation.current?.progress(1).kill();
                        setSelection({
                          item,
                          origin,
                          snapshot: Flip.getState(origin.querySelector("[data-preview-image]")!),
                        });
                      }}
                    >
                      <div
                        data-preview-image
                        data-flip-id={`preview-${item._id}`}
                        className={s.cardImage}
                      >
                        <StoryImage
                          src={item.imageUrl}
                          sizes="(max-width: 620px) 90vw, (max-width: 1000px) 44vw, 28vw"
                        />
                      </div>
                      <span className={s.cardType}>
                        {item.type === "event" ? "Acara" : "Berita"}
                      </span>
                      <span className={s.cardArrow}>
                        <ArrowUpRight size={22} />
                      </span>
                      <span className={s.cardCaption}>
                        <span>
                          {item.category} · {item.date}
                        </span>
                        <strong>{item.title}</strong>
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!isLoading && !error && shown.size === 0 && (
              <div data-empty-results className={s.message}>
                <h3>
                  {hasFilters ? "Belum ada yang cocok." : "Belum ada kabar untuk ditampilkan."}
                </h3>
                <p>
                  {hasFilters
                    ? "Pilih jenis berita/acara atau ubah kata kunci pencarianmu."
                    : "Nantikan berita dan agenda terbaru dari Seni Religi."}
                </p>
                {hasFilters && (
                  <button onClick={reset}>
                    Lihat semua berita &amp; acara <ArrowUpRight size={17} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {!mobile && filtered.length > limit && (
          <div data-archive-pop className={s.more}>
            <button onClick={() => change(() => setPage(page + 1), false)}>
              Lebih banyak cerita <ArrowDownRight size={20} />
            </button>
            <p>
              {shown.size} dari {filtered.length} kabar
            </p>
          </div>
        )}
      </section>
      <StoryPreview selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}
