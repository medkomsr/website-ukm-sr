"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDepartemen } from "@/hooks/useDepartemen";
import { useBidang } from "@/hooks/useBidang";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { srFields } from "@/lib/sr-fields";
import s from "./cabinet.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const structure = ["BKRT", "Minba", "PSDM", "Medkom"];

function TeamCard({ name, image, href }: { name: string; image?: string; href?: string }) {
  const content = <><div className={s.photo}>{image ? <Image src={image} alt={`Pengurus ${name}`} fill sizes="(max-width: 700px) 80vw, 30vw"/> : <div className={s.photoPlaceholder}><ImageIcon size={34} strokeWidth={1}/><span>Foto pengurus {name}</span></div>}</div><div className={s.cardCaption}><h3>{name}</h3>{href && <ArrowUpRight size={22} aria-hidden/>}</div></>;
  return href ? <Link data-team-card className={s.card} href={href}>{content}</Link> : <article data-team-card className={s.card}>{content}</article>;
}

export default function Cabinet() {
  const root = useRef<HTMLDivElement>(null);
  const { data, isError, refetch } = useDepartemen();
  const { data: fields } = useBidang();
  const { data: settings } = useSiteSettings();
  const teams = structure.map(name => {
    const found = data?.find(d => d.abbr.toLowerCase() === name.toLowerCase() || d.slug === name.toLowerCase());
    return { name, image: found?.imageUrl, href: `/tentang/${found?.slug || name.toLowerCase()}` };
  });
  const fieldCards = srFields.map(field => {
    const found = fields?.find(f => f.slug === field.slug);
    return { name: field.name, image: found?.imageUrl, href: `/tentang/bidang/${field.slug}` };
  });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-cabinet-reveal], [data-team-card]").forEach(el => {
        gsap.from(el, { y: 60, opacity: 0, rotateX: 7, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });
      gsap.utils.toArray<HTMLElement>("[data-branch]").forEach(el => {
        gsap.from(el, { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 65%", scrub: .6 } });
      });
    });
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const area = root.current!.querySelector<HTMLElement>("[data-logo-area]")!;
      const outer = area.querySelector<HTMLElement>("[data-logo-tilt]")!;
      const logo = outer.querySelector<HTMLElement>("[data-logo-float]")!;
      const rx = gsap.quickTo(outer, "rotationX", { duration: .7, ease: "power3.out" });
      const ry = gsap.quickTo(outer, "rotationY", { duration: .7, ease: "power3.out" });
      const x = gsap.quickTo(logo, "x", { duration: .7, ease: "power3.out" });
      const y = gsap.quickTo(logo, "y", { duration: .7, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        const box = area.getBoundingClientRect();
        const px = gsap.utils.clamp(0,1,(event.clientX-box.left)/box.width);
        const py = gsap.utils.clamp(0,1,(event.clientY-box.top)/box.height);
        rx(15-py*30); ry(-15+px*30); x(-30+px*60); y(-30+py*60);
      };
      const reset = () => { rx(0); ry(0); x(0); y(0); };
      area.addEventListener("pointermove",move);
      area.addEventListener("pointerleave",reset);
      return () => { area.removeEventListener("pointermove",move); area.removeEventListener("pointerleave",reset); [rx,ry,x,y].forEach(tween=>tween.tween.kill()); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [data, fields], revertOnUpdate: true });

  return <div ref={root}>
    <section id="kabinet-sr" data-tone="green" data-wave className={s.cabinet} aria-labelledby="cabinet-title">
      <header data-logo-area className={s.heading}>
        <h2 data-cabinet-reveal id="cabinet-title" className={s.sectionTitle}>Kenali Kabinet Kami</h2>
        <div data-cabinet-reveal className={s.logoSpace}><div data-logo-tilt className={s.logoTilt}><div data-logo-float className={s.logoFloat}><Image src={settings?.kabinetLogoUrl || "/logo-kabinet-arkhasena-transparent.png"} alt={`Logo ${settings?.kabinetNama || "Kabinet Arkhasena"}`} fill sizes="(max-width: 733px) 220px, (max-width: 1200px) 30vw, 360px"/></div></div></div>
        <p data-cabinet-reveal className={s.cabinetName}>{settings?.kabinetNama || "Kabinet Arkhasena"}</p>
      </header>
      {isError && <div className={s.notice}>Foto kepengurusan belum dapat dimuat. <button onClick={() => refetch()}>Coba lagi</button></div>}
      <div className={s.tree} aria-label="Bagan kepengurusan: BKRT membawahi Minba, PSDM, dan Medkom">
        <div className={s.rootCard}><TeamCard {...teams[0]}/></div>
        <div data-branch className={s.stem} aria-hidden/>
        <div className={s.children}>{teams.slice(1).map(team => <div className={s.child} key={team.name}><span data-branch className={s.branch} aria-hidden/><TeamCard {...team}/></div>)}</div>
      </div>
    </section>
    <section data-tone="cream" data-wave className={s.fields} aria-labelledby="field-team-title">
      <h2 data-cabinet-reveal id="field-team-title" className={s.sectionTitle}>Pengurus Bidang</h2>
      <div className={s.fieldGrid}>{fieldCards.map(field => <TeamCard key={field.name} {...field}/>)}</div>
    </section>
  </div>;
}
