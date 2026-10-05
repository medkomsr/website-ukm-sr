"use client";

import { useLayoutEffect, useRef } from "react";
import { createPortal, flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { SanityActivity } from "@/sanity/types";
import s from "@/features/activities/components/newsroom.module.scss";

gsap.registerPlugin(Flip);
export type PreviewSelection = {
  item: SanityActivity;
  origin: HTMLButtonElement;
  snapshot: ReturnType<typeof Flip.getState>;
};

export default function StoryPreview({
  selection,
  onClose,
}: {
  selection: PreviewSelection | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Animation | null>(null);
  const closing = useRef(false);

  useLayoutEffect(() => {
    if (!selection || !dialog.current || !photo.current) return;
    const modal = dialog.current;
    const image = photo.current;
    const content = copy.current;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closing.current = false;
    delete modal.dataset.closing;
    modal.showModal();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(content, { autoAlpha: 0 });
    const entrance = gsap.timeline();
    entrance.add(
      Flip.from(selection.snapshot, {
        targets: image,
        scale: true,
        clearProps: false,
        duration: reduced ? 0 : 0.7,
        ease: "power2.inOut",
      }),
    );
    entrance.fromTo(
      content,
      { autoAlpha: 0, x: 20 },
      { autoAlpha: 1, x: 0, duration: reduced ? 0 : 0.4, ease: "power2.out" },
    );
    animation.current = entrance;
    return () => {
      animation.current?.kill();
      gsap.killTweensOf(content);
      gsap.set(image, { clearProps: "all" });

      modal.close();
      document.body.style.overflow = bodyOverflow;
    };
  }, [selection]);

  const close = () => {
    if (!selection || closing.current) return;
    closing.current = true;
    const { origin } = selection;
    if (dialog.current) dialog.current.dataset.closing = "true";
    const finish = () => {
      // Restore the source card and dismiss its duplicate within the same frame.
      flushSync(onClose);
      origin.focus({ preventScroll: true });
    };
    const entrance = animation.current;
    if (
      !entrance ||
      entrance.time() === 0 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }
    // Reverse from the current frame, including an interrupted opening animation.
    entrance.eventCallback("onReverseComplete", finish);
    entrance.timeScale(1.25).reverse();
  };
  const item = selection?.item;
  if (!item) return null;
  // Keep both entry points independent of their page typography and transformed galleries.
  return createPortal(
    <dialog
      ref={dialog}
      className={s.modal}
      aria-labelledby="story-preview-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {item && (
        <div className={s.modalContent}>
          <button className={s.closeModal} aria-label="Tutup pratinjau" onClick={close} autoFocus>
            <X size={22} />
          </button>
          <div ref={photo} className={s.modalImage} data-flip-id={`preview-${item._id}`}>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                fill
                sizes="(max-width: 700px) 90vw, 45vw"
                className={s.cover}
              />
            ) : (
              <div className={s.imageFallback}>SR.</div>
            )}
          </div>
          <div ref={copy} className={s.modalCopy}>
            <div className={s.cardMeta}>
              <span>
                {item.type === "event" ? "Acara" : "Berita"} · {item.category}
              </span>
              <span>{item.date}</span>
            </div>
            <h2 id="story-preview-title">{item.title}</h2>
            <p>{item.description}</p>
            {item.type === "event" && item.location && (
              <p className={s.modalLocation}>
                {item.location}
                {item.time ? ` · ${item.time}` : ""}
              </p>
            )}
            <Link className={s.previewCta} href={`/aktivitas/${item.slug}`} onNavigate={onClose}>
              <span>
                Lihat selengkapnya <ArrowRight size={19} />
              </span>
            </Link>
          </div>
        </div>
      )}
    </dialog>,
    document.body,
  );
}
