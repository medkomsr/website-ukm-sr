"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Expand, X } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { SanityBidangGalleryItem } from "@/sanity/types";
import s from "./documentation-collage.module.css";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

export default function DocumentationCollage({ name, items }: { name: string; items: SanityBidangGalleryItem[] }) {
  const photos = items.filter(item => !!item.imageUrl);
  const [active, setActive] = useState<number | null>(null);
  const uid = useId();
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const enlarged = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const snapshot = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const animation = useRef<gsap.core.Animation | null>(null);
  const closing = useRef(false);
  const selected = active === null ? null : photos[active];

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = root.current!.querySelectorAll<HTMLElement>(`[data-documentation-intro], .${s.tile}`);
      elements.forEach(element => {
        gsap.from(element, {
          opacity: 0, y: 24, duration: .9, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [photos.length], revertOnUpdate: true });

  useLayoutEffect(() => {
    if (active === null || !dialog.current || !enlarged.current) return;
    const modal = dialog.current;
    const photo = enlarged.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    delete modal.dataset.closing;
    modal.showModal();
    if (snapshot.current) animation.current = Flip.from(snapshot.current, {
      targets: photo, scale: true, duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .7,
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
    setActive(index);
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
    if (!target || !enlarged.current || matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    animation.current = Flip.fit(enlarged.current, target, { scale: true, duration: .7, ease: "power1.inOut", onComplete: finish }) as gsap.core.Tween;
  };

  return <section ref={root} data-tone="green" className={s.section} aria-labelledby={`${uid}-title`}>
    <header data-documentation-intro className={s.heading}><h2 id={`${uid}-title`}>Galeri</h2></header>
    {photos.length ? <div className={s.collage}>
      {photos.map((item, index) => <button key={`${item.imageUrl}-${index}`} className={s.tile} onClick={event => open(index, event.currentTarget)} aria-label={`Perbesar foto: ${item.alt || item.caption || `${name} ${index + 1}`}`} aria-haspopup="dialog">
        <div data-collage-photo data-flip-id={`${uid}-${index}`} className={s.photo}>
          <Image src={item.imageUrl} alt={item.alt || `Dokumentasi ${name} ${index + 1}`} fill sizes="(max-width: 700px) 90vw, 60vw"/>
        </div>
        <span className={s.expand} aria-hidden><Expand size={20}/></span>
        {item.caption && <span className={s.caption}>{item.caption}</span>}
      </button>)}
    </div> : <><p data-documentation-intro className={s.empty}>Dokumentasi {name} belum tersedia. Momen kebersamaan akan ditampilkan di sini.</p><div className={s.collage} aria-hidden>{Array.from({length:6}, (_, index) => <div key={index} className={`${s.tile} ${s.placeholder}`}><ImageIcon size={36} strokeWidth={1}/></div>)}</div></>}
    <dialog ref={dialog} className={s.modal} aria-label={`Dokumentasi ${name}`} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <button className={s.close} onClick={close} aria-label="Tutup foto" autoFocus><X size={24}/></button>
      {selected && <figure className={s.figure}>
        <div ref={enlarged} data-flip-id={`${uid}-${active}`} className={s.enlarged}>
          <Image src={selected.imageUrl} alt={selected.alt || `Dokumentasi ${name}`} fill sizes="90vw"/>
        </div>
        {selected.caption && <figcaption>{selected.caption}</figcaption>}
      </figure>}
    </dialog>
  </section>;
}
