"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Expand, X } from "lucide-react";
import { gsap } from "gsap";
import type { SanityPrestasi } from "@/sanity/types";
import { AchievementPhotoPlaceholder } from "./achievement-photo-placeholder";
import s from "@/features/achievements/components/achievements.module.scss";

type Selection = { item: SanityPrestasi; origin: HTMLButtonElement };

function AchievementPhoto({ item }: { item: SanityPrestasi }) {
  const viewer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const { imageUrl, imageAlt, imageAspectRatio, imageHotspot, title } = item;
  const alt = imageAlt || `Foto kejuaraan ${title}`;
  const portrait = imageAspectRatio !== undefined && imageAspectRatio < 1;

  if (!imageUrl) {
    return (
      <figure className={s.dialogPhoto}>
        <div className={s.photoFrame}>
          <AchievementPhotoPlaceholder />
        </div>
      </figure>
    );
  }

  return (
    <>
      <figure className={s.dialogPhoto}>
        <button
          ref={trigger}
          type="button"
          className={s.photoButton}
          aria-label="Lihat foto utuh"
          aria-haspopup="dialog"
          onClick={() => {
            setShowOriginal(true);
            viewer.current?.showModal();
          }}
        >
          <span className={s.photoFrame}>
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 700px) 92vw, (max-width: 1200px) 52vw, 620px"
              className={s.achievementImage}
              style={
                portrait
                  ? {
                      objectFit: "cover",
                      objectPosition: `${(imageHotspot?.x ?? 0.5) * 100}% ${(imageHotspot?.y ?? 0.65) * 100}%`,
                    }
                  : undefined
              }
            />
          </span>
          <span className={s.photoAction}>
            <Expand size={15} aria-hidden="true" /> Lihat foto utuh
          </span>
        </button>
      </figure>
      {createPortal(
        <dialog
          ref={viewer}
          className={s.fullPhotoDialog}
          aria-labelledby="achievement-photo-title"
          onCancel={(event) => event.stopPropagation()}
          onClose={() => {
            setShowOriginal(false);
            trigger.current?.focus({ preventScroll: true });
          }}
          onClick={(event) => {
            if (event.currentTarget === event.target) event.currentTarget.close();
          }}
        >
          <header className={s.fullPhotoHeader}>
            <h2 id="achievement-photo-title">{title}</h2>
            <button type="button" onClick={() => viewer.current?.close()}>
              Kembali ke detail
            </button>
          </header>
          <div className={s.fullPhotoFrame}>
            {showOriginal && (
              <Image
                src={imageUrl}
                alt={alt}
                fill
                sizes="(max-width: 1146px) 96vw, 1100px"
                className={s.achievementImage}
              />
            )}
          </div>
        </dialog>,
        document.body,
      )}
    </>
  );
}

export default function AchievementDialog({
  selection,
  onClose,
}: {
  selection: Selection | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  useLayoutEffect(() => {
    if (!selection || !dialog.current || !panel.current) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closing.current = false;
    modal.showModal();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      animation.current = gsap
        .timeline()
        .fromTo(
          panel.current,
          { y: 40, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: reduced ? 0 : 0.55, ease: "power3.out" },
        )
        .from(
          "[data-dialog-copy]",
          { y: 20, opacity: 0, stagger: 0.055, duration: reduced ? 0 : 0.4 },
          reduced ? 0 : 0.2,
        );
    }, modal);
    return () => {
      context.revert();
      modal.close();
      document.body.style.overflow = overflow;
    };
  }, [selection]);
  const close = () => {
    if (!selection || closing.current) return;
    closing.current = true;
    const origin = selection.origin;
    const finish = () => {
      flushSync(onClose);
      origin.focus({ preventScroll: true });
    };
    if (
      !animation.current ||
      animation.current.time() === 0 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }
    animation.current.eventCallback("onReverseComplete", finish).timeScale(1.5).reverse();
  };
  if (!selection) return null;
  const item = selection.item;
  return createPortal(
    <dialog
      ref={dialog}
      className={s.dialog}
      aria-labelledby="achievement-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) close();
      }}
    >
      <div ref={panel} className={s.dialogPanel}>
        <header className={s.dialogBar}>
          <div className={s.dialogMetadata}>
            <strong>{item.field || item.category}</strong>
            <span>{item.year}</span>
            <span>{item.level}</span>
          </div>
          <button
            type="button"
            className={s.dialogClose}
            onClick={close}
            autoFocus
            aria-label="Tutup detail prestasi"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        <div className={s.dialogContent} tabIndex={0} role="region" aria-label="Detail prestasi">
          <header className={s.dialogHeading} data-dialog-copy>
            <h2 id="achievement-dialog-title">{item.title}</h2>
            <p className={s.dialogPosition}>{item.position || "Pencapaian Seni Religi"}</p>
          </header>
          <AchievementPhoto key={item._id} item={item} />
          <section className={s.dialogCopy}>
            <p className={s.description} data-dialog-copy>
              {item.description}
            </p>
            {(item.organizer || item.location) && (
              <dl className={s.detailMeta} data-dialog-copy>
                {item.organizer && (
                  <div>
                    <dt>PENYELENGGARA</dt>
                    <dd>{item.organizer}</dd>
                  </div>
                )}
                {item.location && (
                  <div>
                    <dt>LOKASI</dt>
                    <dd>{item.location}</dd>
                  </div>
                )}
              </dl>
            )}
            {!!item.participants?.length && (
              <div className={s.dialogWinners} data-dialog-copy>
                <h3>Di balik pencapaian ini</h3>
                {item.participants.map((person) => (
                  <div key={person._key}>
                    <span className={s.avatar} aria-hidden="true">
                      {person.imageUrl ? (
                        <Image src={person.imageUrl} alt="" fill sizes="48px" className={s.photo} />
                      ) : (
                        person.name[0]
                      )}
                    </span>
                    <span>
                      <strong>{person.name}</strong>
                      <small>{person.faculty}</small>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {item.articleSlug && (
              <Link
                href={`/aktivitas/${item.articleSlug}`}
                onNavigate={onClose}
                className={s.pill}
                data-dialog-copy
              >
                Baca kisah kemenangan <ArrowUpRight size={18} />
              </Link>
            )}
          </section>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
