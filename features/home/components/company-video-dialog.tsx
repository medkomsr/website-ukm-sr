"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { CompanyVideo } from "./company-video";
import v from "./company-video.module.scss";

export type VideoOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
  trigger: HTMLButtonElement;
};
export function CompanyVideoDialog({
  url,
  origin,
  close,
}: {
  url: string;
  origin: VideoOrigin;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(true);
  const closeAnimated = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setActive(false);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(panel.current);
    gsap.to(panel.current, {
      clipPath: `inset(${Math.max(0, origin.top)}px ${Math.max(0, innerWidth - origin.left - origin.width)}px ${Math.max(0, innerHeight - origin.top - origin.height)}px ${Math.max(0, origin.left)}px round 22px)`,
      opacity: 0,
      duration: reduced ? 0 : 0.55,
      ease: "power3.inOut",
      onComplete: close,
    });
  }, [close, origin]);
  useEffect(() => {
    const element = dialog.current!;
    const panelElement = panel.current;
    const previous = origin.trigger;
    const overflow = document.body.style.overflow;
    element.showModal();
    closeButton.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      gsap.fromTo(
        panel.current,
        {
          clipPath: `inset(${Math.max(0, origin.top)}px ${Math.max(0, innerWidth - origin.left - origin.width)}px ${Math.max(0, innerHeight - origin.top - origin.height)}px ${Math.max(0, origin.left)}px round 22px)`,
        },
        {
          clipPath: "inset(0px 0px 0px 0px round 0px)",
          duration: reduced ? 0 : 0.85,
          ease: "power3.inOut",
        },
      );
      if (!reduced)
        gsap.from("[data-video-controls]", { y: 24, opacity: 0, duration: 0.5, delay: 0.45 });
    }, element);
    return () => {
      context.revert();
      gsap.killTweensOf(panelElement);
      document.body.style.overflow = overflow;
      element.close();
      previous.focus({ preventScroll: true });
    };
  }, [origin]);
  return createPortal(
    <dialog
      ref={dialog}
      className={v.dialog}
      aria-label="Video company profile Seni Religi"
      onCancel={(event) => {
        event.preventDefault();
        closeAnimated();
      }}
    >
      <div ref={panel} className={v.panel}>
        <CompanyVideo url={url} active={active} />
        <button
          ref={closeButton}
          onClick={closeAnimated}
          aria-label="Tutup video"
          className={v.close}
        >
          <X size={23} />
          <span>TUTUP</span>
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
