"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import s from "./scroll-gallery.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);
export type GalleryItem = { title: string; description: string; image?: string; placeholder?: boolean };

export default function ScrollGallery({ id, title, items, tone, count, countLabel = "PROGRAM", last = false }: { id: string; title: string; items: GalleryItem[]; tone: "green" | "cream"; count?: number; countLabel?: string; last?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const controls = useRef<(step: number) => void>(() => {});
  const [active, setActive] = useState(0);
  const uid = useId();
  useGSAP(() => {
    const section = root.current!;
    const stage = section.querySelector<HTMLElement>("[data-gallery-stage]")!;
    const pin = section.querySelector<HTMLElement>("[data-panel-pin]")!;
    const track = section.querySelector<HTMLElement>("[data-gallery-track]")!;
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-gallery-card]"));
    const proxy = section.querySelector<HTMLElement>("[data-drag-proxy]")!;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      stage.dataset.enhanced = "true";
      const playhead = { value: 0 };
      let target = 0;
      let selected = -1;
      let previousProgress = 0;
      const wrap = gsap.utils.wrap(-cards.length / 2, cards.length / 2);
      const paint = () => {
        const next = gsap.utils.wrap(0, cards.length, Math.round(playhead.value));
        if (next !== selected) { selected = next; setActive(next); }
        cards.forEach((card, i) => {
          const offset = cards.length === 1 ? 0 : wrap(i - playhead.value);
          const distance = Math.abs(offset);
          gsap.set(card, { xPercent: offset * 112, scale: Math.max(.65, 1 - distance * .16), rotationY: offset * -9, opacity: Math.max(0, 1 - distance * .38), zIndex: Math.round(100 - distance * 10), visibility: distance > 2 ? "hidden" : "visible" });
        });
      };
      const move = (value: number) => {
        target = value;
        gsap.to(playhead, { value, duration: .55, ease: "power3.out", overwrite: true, onUpdate: paint });
      };
      controls.current = step => move(Math.round(target) + step);
      paint();
      let startOffset = 0;
      const drag = cards.length > 1 ? Draggable.create(proxy, {
        type: "x", trigger: track, allowNativeTouchScrolling: true,
        onPress() { startOffset = target; gsap.killTweensOf(playhead); },
        onDrag() { target = startOffset + (this.startX - this.x) / (cards[0].offsetWidth * 1.12); playhead.value = target; paint(); },
        onDragEnd() { move(Math.round(target)); },
      })[0] : undefined;
      const travel = () => cards.length > 1 ? Math.max(600,(cards.length-1)*innerHeight*.65) : 0;
      const measure = () => { section.style.paddingBottom = `${travel()}px`; };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);
      // Read tall content normally first, explore the cards, then shrink the outgoing panel.
      // One pin owns both phases, preventing competing nested gallery/section pins.
      const transition = gsap.timeline({ paused: true });
      if (!last) transition.to(stage,{scale:.7,opacity:.5,duration:.9,ease:"none"}).to(stage,{opacity:0,duration:.1,ease:"none"});
      const trigger = (!last || cards.length > 1) ? ScrollTrigger.create({
        trigger: pin, start: "clamp(bottom bottom)", end: () => `+=${travel()+(last ? 0 : innerHeight)}`,
        pin, pinSpacing: false, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate(self) {
          const elapsed = self.progress*(self.end-self.start);
          const progress = travel() ? Math.min(1,elapsed/travel()) : 0;
          const delta = progress-previousProgress; previousProgress=progress;
          if (!drag?.isDragging && delta) move(target+delta*(cards.length-1));
          if (!last) transition.progress(gsap.utils.clamp(0,1,(elapsed-travel())/innerHeight));
        },
      }) : undefined;
      gsap.from(section.querySelectorAll("[data-gallery-reveal]"), {
        y: 65, opacity: 0, stagger: .12, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: stage, start: "top 78%", toggleActions: "play none none reverse" },
      });
      const snap = () => { if (trigger?.isActive && !drag?.isDragging) move(Math.round(target)); };
      ScrollTrigger.addEventListener("scrollEnd", snap);
      return () => { trigger?.kill(); transition.kill(); drag?.kill(); gsap.killTweensOf(playhead); ScrollTrigger.removeEventListener("scrollEnd", snap); ScrollTrigger.removeEventListener("refreshInit", measure); section.style.removeProperty("padding-bottom"); delete stage.dataset.enhanced; controls.current = () => {}; };
    });
    media.add("(prefers-reduced-motion: reduce)", () => {
      let index = 0;
      controls.current = step => { index = gsap.utils.wrap(0,cards.length,index+step); track.scrollTo({left:cards[index].offsetLeft-track.offsetLeft,behavior:"instant"}); setActive(index); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [items.length,last], revertOnUpdate: true });

  return <section ref={root} id={id} className={s.section} aria-labelledby={`${id}-title`} tabIndex={-1}>
    <div data-panel-pin className={s.panelPin}>
    <div data-gallery-stage data-tone={tone} className={`${s.stage} ${count !== undefined ? s.sideLayout : ""}`}>
      <header className={s.heading}><h2 data-gallery-reveal id={`${id}-title`}>{title}</h2>{count !== undefined && <p data-gallery-reveal className={s.count}><strong>{String(count).padStart(2,"0")}</strong><span>{countLabel}</span></p>}</header>
      <div data-gallery-reveal className={s.gallery}>
      <div className={s.viewport}>
        <ul data-gallery-track id={uid} className={s.track} aria-label={title}>
          {items.map((item,i)=><li data-gallery-card className={s.card} key={`${i}-${item.title}`}>
            <div className={s.photo}>{item.image ? <Image draggable={false} src={item.image} alt={item.title} fill sizes="(max-width: 700px) 72vw, 340px"/> : <div className={s.placeholder}><ImageIcon size={46} strokeWidth={1}/><span>{item.placeholder ? "Menunggu data resmi" : "Seni Religi"}</span></div>}</div>
            <div className={s.caption}><h3>{item.title}</h3><p>{item.description}</p></div>
          </li>)}
        </ul>
      </div>
      <div className={s.actions}><button disabled={items.length < 2} aria-label={`${title} sebelumnya`} aria-controls={uid} onClick={()=>controls.current(-1)}><ArrowLeft size={20}/></button><span aria-live="polite" aria-atomic="true">{String(active+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</span><button disabled={items.length < 2} aria-label={`${title} berikutnya`} aria-controls={uid} onClick={()=>controls.current(1)}><ArrowRight size={20}/></button></div>
      {items.length > 1 && <p className={s.hint}>Gulir atau geser untuk menjelajahi</p>}
      </div>
      <div data-drag-proxy className={s.proxy}/>
    </div>
    </div>
  </section>;
}
