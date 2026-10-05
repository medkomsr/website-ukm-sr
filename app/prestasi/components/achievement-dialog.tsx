"use client";

import { useLayoutEffect, useRef } from "react";
import { createPortal, flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon, X } from "lucide-react";
import { gsap } from "gsap";
import type { SanityPrestasi } from "@/sanity/types";
import s from "./achievements.module.css";

type Selection = {item: SanityPrestasi; origin: HTMLButtonElement};
export default function AchievementDialog({selection,onClose}: {selection: Selection | null; onClose: ()=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  useLayoutEffect(()=>{
    if (!selection || !dialog.current || !panel.current) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closing.current = false;
    modal.showModal();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(()=>{
      animation.current = gsap.timeline()
        .fromTo(panel.current,{y:40,scale:.96,opacity:0},{y:0,scale:1,opacity:1,duration:reduced?0:.55,ease:"power3.out"})
        .from("[data-dialog-copy]",{y:20,opacity:0,stagger:.055,duration:reduced?0:.4},reduced?0:.2);
    },modal);
    return ()=>{context.revert();modal.close();document.body.style.overflow=overflow;};
  },[selection]);
  const close = ()=>{
    if (!selection || closing.current) return;
    closing.current = true;
    const origin = selection.origin;
    const finish = ()=>{flushSync(onClose);origin.focus({preventScroll:true});};
    if (!animation.current || animation.current.time()===0 || matchMedia("(prefers-reduced-motion: reduce)").matches) {finish();return;}
    animation.current.eventCallback("onReverseComplete",finish).timeScale(1.5).reverse();
  };
  if (!selection) return null;
  const item = selection.item;
  return createPortal(<dialog ref={dialog} className={s.dialog} aria-labelledby="achievement-dialog-title" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.currentTarget===event.target)close();}}>
    <div ref={panel} className={s.dialogPanel}>
      <button className={s.dialogClose} onClick={close} autoFocus aria-label="Tutup detail prestasi"><X size={22}/></button>
      <div className={s.dialogPhoto}>{item.imageUrl ? <Image src={item.imageUrl} alt={item.imageAlt || `Foto kejuaraan ${item.title}`} fill sizes="(max-width: 700px) 92vw, 550px" className={s.achievementImage}/> : <div className={s.photoPlaceholder}><ImageIcon size={38} strokeWidth={1}/><strong>Foto kejuaraan</strong><p>Dokumentasi pemenang atau penyerahan piala akan tampil di sini.</p></div>}<span>{item.year} / {item.level}</span></div>
      <div className={s.dialogCopy} tabIndex={0} role="region" aria-label="Detail prestasi"><span className={s.eyebrow} data-dialog-copy>{item.field || item.category}</span><p className={s.dialogPosition} data-dialog-copy>{item.position || "Pencapaian Seni Religi"}</p><h2 id="achievement-dialog-title" data-dialog-copy>{item.title}</h2><p className={s.description} data-dialog-copy>{item.description}</p>
        <dl className={s.detailMeta} data-dialog-copy>{item.organizer && <div><dt>PENYELENGGARA</dt><dd>{item.organizer}</dd></div>}{item.location && <div><dt>LOKASI</dt><dd>{item.location}</dd></div>}</dl>
        {!!item.participants?.length && <div className={s.dialogWinners} data-dialog-copy><h3>DI BALIK PENCAPAIAN INI</h3>{item.participants.map(person=><div key={person._key}><span className={s.avatar}>{person.imageUrl ? <Image src={person.imageUrl} alt="" fill sizes="48px" className={s.photo}/> : person.name[0]}</span><span><strong>{person.name}</strong><small>{person.faculty}</small></span></div>)}</div>}
        {item.articleSlug && <Link href={`/aktivitas/${item.articleSlug}`} onNavigate={onClose} className={s.pill} data-dialog-copy>Baca kisah kemenangan <ArrowUpRight size={18}/></Link>}
      </div>
    </div>
  </dialog>,document.body);
}
