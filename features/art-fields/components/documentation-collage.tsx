"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import CollageImage from "./collage-image";
import { Expand, ImageIcon, X } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "@/features/art-fields/components/documentation-collage.module.scss";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

function EnlargedPhoto({
  src,
  alt,
  preview,
  aspectRatio,
  frameRef,
  flipId,
}: {
  src: string;
  alt: string;
  preview?: string;
  aspectRatio: number;
  frameRef: Ref<HTMLDivElement>;
  flipId: string;
}) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const [load, setLoad] = useState({
    attempt: 0,
    status: "loading" as "loading" | "ready" | "failed",
    ratio: aspectRatio,
  });

  function finish(status: "ready" | "failed", ratio?: number) {
    setLoad((current) =>
      current.attempt === load.attempt
        ? { ...current, status, ratio: ratio || current.ratio }
        : current,
    );
  }

  return (
    <figure className={s.figure} style={{ "--photo-ratio": load.ratio } as CSSProperties}>
      <div ref={frameRef} data-flip-id={flipId} className={s.enlarged}>
        {preview && !previewFailed && load.status !== "ready" && (
          // Reuse the thumbnail request, including its selected srcset width.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={alt}
            className={s.preview}
            onError={() => setPreviewFailed(true)}
          />
        )}
        <CollageImage
          key={load.attempt}
          variant={load.attempt === 0 ? "enlarged" : "retry"}
          src={src}
          alt={alt}
          fill
          className={load.status === "ready" ? undefined : s.pendingImage}
          onLoad={(event) => {
            const image = event.currentTarget;
            finish("ready", image.naturalWidth / image.naturalHeight);
          }}
          onError={() => finish("failed")}
        />
        {load.status !== "ready" && (
          <div className={s.feedback}>
            <span role="status">
              {load.status === "loading"
                ? "Memuat foto…"
                : "Foto belum dapat dimuat dalam ukuran besar."}
            </span>
            {load.status === "failed" && (
              <button
                type="button"
                onClick={() =>
                  setLoad((current) => ({
                    ...current,
                    attempt: current.attempt + 1,
                    status: "loading",
                  }))
                }
              >
                Coba lagi
              </button>
            )}
          </div>
        )}
      </div>
    </figure>
  );
}

export default function DocumentationCollage({
  name,
  items,
  title = "Galeri",
  tone = "green",
}: {
  name: string;
  title?: string;
  tone?: "green" | "cream";
  items: {
    imageUrl: string;
    alt?: string;
    caption?: string;
    hotspot?: { x: number; y: number };
    showFullImage?: boolean;
    aspectRatio?: number;
  }[];
}) {
  const photos = items.filter((item) => !!item.imageUrl);
  const [active, setActive] = useState<{ index: number; preview?: string; ratio?: number } | null>(
    null,
  );
  const uid = useId();
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const enlarged = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const snapshot = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const animation = useRef<gsap.core.Animation | null>(null);
  const closing = useRef(false);
  const selected = active === null ? null : photos[active.index];

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const elements = root.current!.querySelectorAll<HTMLElement>(
          `[data-documentation-intro], .${s.tile}`,
        );
        elements.forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [photos.length], revertOnUpdate: true },
  );

  useLayoutEffect(() => {
    if (active === null || !dialog.current || !enlarged.current) return;
    const modal = dialog.current;
    const photo = enlarged.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    delete modal.dataset.closing;
    modal.showModal();
    if (snapshot.current)
      animation.current = Flip.from(snapshot.current, {
        targets: photo,
        scale: true,
        duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.7,
        ease: "power1.inOut",
      });
    return () => {
      animation.current?.kill();
      gsap.set(photo, { clearProps: "all" });
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  const open = (index: number, button: HTMLButtonElement) => {
    if (active !== null) return;
    origin.current = button;
    snapshot.current = Flip.getState(button.querySelector("[data-collage-photo]")!);
    closing.current = false;
    const thumbnail = button.querySelector("img");
    const loaded = thumbnail && thumbnail.naturalWidth > 0 && thumbnail.naturalHeight > 0;
    setActive({
      index,
      preview: thumbnail && (!thumbnail.complete || loaded) ? thumbnail.currentSrc : undefined,
      ratio: loaded ? thumbnail.naturalWidth / thumbnail.naturalHeight : undefined,
    });
  };
  const close = () => {
    if (closing.current || active === null) return;
    closing.current = true;
    if (dialog.current) dialog.current.dataset.closing = "true";
    animation.current?.kill();
    const finish = () => {
      dialog.current?.close();
      setActive(null);
      origin.current?.focus({ preventScroll: true });
      closing.current = false;
    };
    const target = origin.current?.querySelector("[data-collage-photo]");
    if (!target || !enlarged.current || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    animation.current = Flip.fit(enlarged.current, target, {
      scale: true,
      duration: 0.7,
      ease: "power1.inOut",
      onComplete: finish,
    }) as gsap.core.Tween;
  };

  // Each column stacks independently so a portrait cannot stretch the other column.
  const naturalLayout = photos.every((item) => item.showFullImage && item.aspectRatio);
  const columns: number[][] = [[], []];
  const heights = [0, 0];
  if (naturalLayout) {
    photos.forEach((item, index) => {
      const column = heights[0] <= heights[1] ? 0 : 1;
      columns[column].push(index);
      heights[column] += (column === 0 ? 7 : 5) / item.aspectRatio!;
    });
  }

  const renderPhoto = (item: (typeof photos)[number], index: number) => (
    <button
      key={`${item.imageUrl}-${index}`}
      className={s.tile}
      style={naturalLayout ? { order: index } : undefined}
      data-natural-ratio={item.showFullImage && !!item.aspectRatio ? true : undefined}
      onClick={(event) => open(index, event.currentTarget)}
      aria-label={`Perbesar foto: ${item.alt || item.caption || `${name} ${index + 1}`}`}
      aria-haspopup="dialog"
    >
      <div
        data-collage-photo
        data-flip-id={`${uid}-${index}`}
        className={s.photo}
        style={item.showFullImage ? { aspectRatio: item.aspectRatio } : undefined}
      >
        <CollageImage
          variant="thumbnail"
          src={item.imageUrl}
          alt={item.alt || `Dokumentasi ${name} ${index + 1}`}
          fill
          style={{
            objectFit: item.showFullImage ? "contain" : undefined,
            objectPosition:
              !item.showFullImage && item.hotspot
                ? `${item.hotspot.x * 100}% ${item.hotspot.y * 100}%`
                : undefined,
          }}
        />
      </div>
      <span className={s.expand} aria-hidden>
        <Expand size={20} />
      </span>
    </button>
  );

  return (
    <section ref={root} data-tone={tone} className={s.section} aria-labelledby={`${uid}-title`}>
      <header data-documentation-intro className={s.heading}>
        <h2 id={`${uid}-title`}>{title}</h2>
      </header>
      {photos.length ? (
        <div className={`${s.collage} ${naturalLayout ? s.naturalCollage : ""}`}>
          {naturalLayout
            ? columns.map((column, index) => (
                <div key={index} className={s.column}>
                  {column.map((photoIndex) => renderPhoto(photos[photoIndex], photoIndex))}
                </div>
              ))
            : photos.map(renderPhoto)}
        </div>
      ) : (
        <>
          <p data-documentation-intro className={s.empty}>
            Dokumentasi {name} belum tersedia. Momen kebersamaan akan ditampilkan di sini.
          </p>
          <div className={s.collage} aria-hidden>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className={`${s.tile} ${s.placeholder}`}>
                <ImageIcon size={36} strokeWidth={1} />
              </div>
            ))}
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        className={s.modal}
        aria-label={`Dokumentasi ${name}`}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <button className={s.close} onClick={close} aria-label="Tutup foto" autoFocus>
          <X size={24} />
        </button>
        {active && selected && (
          <EnlargedPhoto
            key={selected.imageUrl}
            src={selected.imageUrl}
            alt={selected.alt || selected.caption || `Dokumentasi ${name} ${active.index + 1}`}
            preview={active.preview}
            aspectRatio={active.ratio ?? selected.aspectRatio ?? 1.5}
            frameRef={enlarged}
            flipId={`${uid}-${active.index}`}
          />
        )}
      </dialog>
    </section>
  );
}
