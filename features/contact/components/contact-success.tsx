"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, X } from "lucide-react";
import { gsap } from "gsap";
import s from "@/features/contact/components/contact.module.scss";

export default function ContactSuccess({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(dialog.current, {
        autoAlpha: 0,
        y: 30,
        scale: 0.96,
        duration: 0.55,
        ease: "power3.out",
      });
      gsap.from("[data-success-reveal]", {
        autoAlpha: 0,
        y: 22,
        stagger: 0.1,
        duration: 0.65,
        delay: 0.15,
        ease: "power3.out",
      });
    }, dialog);
    return () => {
      context.revert();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <dialog
      ref={dialog}
      className={s.success}
      aria-labelledby="contact-success-title"
      aria-describedby="contact-success-description"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={s.successPanel}>
        <button
          type="button"
          className={s.successClose}
          aria-label="Tutup ucapan terima kasih"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className={s.successIcon} data-success-reveal aria-hidden="true">
          <Check size={28} />
        </div>
        <h2 id="contact-success-title" data-success-reveal>
          Terima <em>kasih!</em>
        </h2>
        <p id="contact-success-description" data-success-reveal>
          Request Anda berhasil dikirim. Tim Seni Religi akan meninjau pesan dan menghubungi Anda
          melalui email.
        </p>
        <button type="button" className={s.sendButton} onClick={onClose} data-success-reveal>
          <span>
            Kembali ke halaman <ArrowUpRight size={20} />
          </span>
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
