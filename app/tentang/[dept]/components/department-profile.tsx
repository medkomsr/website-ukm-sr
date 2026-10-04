"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useDepartemenBySlug } from "@/hooks/useDepartemen";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { SanityDepartemenDetail, SanityDeptMember } from "@/sanity/types";
import ScrollGallery from "./scroll-gallery";
import s from "./department-profile.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);
const reservedDepartments: Record<string,string> = { bkrt: "BKRT", minba: "Minba", psdm: "PSDM", medkom: "Medkom" };
function previewDepartment(slug: string): SanityDepartemenDetail {
  const abbr = reservedDepartments[slug];
  return { _id: `${slug}-preview`, slug, heading: slug === "bkrt" ? "Badan" : "Departemen", abbr, fullName: "", imageUrl: "", overlay: "",
    description: `Kenali peran ${abbr}, program kerja, dan orang-orang yang menjalankannya.`, programs: [], programDescriptions: [],
    kepala: { name: "", role: "", fakultas: "", angkatan: "" }, divisi: [] };
}

export function ProfileContent({ data, fieldDescription, children }: { data: SanityDepartemenDetail; fieldDescription?: string; children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { data: settings } = useSiteSettings();
  const members = [data.kepala, ...(data.divisi || []).flatMap(group => [group.kepala, ...(group.staff || [])])].filter((member): member is SanityDeptMember => !!member?.name);
  const programs = data.programs || [];
  const activityId = fieldDescription !== undefined ? "deskripsi-bidang" : "program-kerja";
  const programCards = programs.length ? programs.map((title,i)=>({title, description: data.programDescriptions?.[i] || "", image: data.programImages?.[i]})) : [{title:"Program kerja",description:"Detail program belum tersedia.",placeholder:true}];
  const peopleCards = members.length ? members.map(member=>({title:member.name,description:member.role || "Pengurus",image:member.imageUrl})) : [{title:"Nama pengurus",description:"Jabatan belum tersedia.",placeholder:true}];

  const { contextSafe } = useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-intro]", { y: 65, opacity: 0, stagger: .12, duration: 1.2, ease: "power3.out" });
      gsap.to("[data-orbit]", { rotation: 360, duration: 90, ease: "none", repeat: -1 });
      gsap.utils.toArray<HTMLElement>("[data-profile-panel]").forEach((panel,index) => {
        const surface = panel.firstElementChild!;
        gsap.timeline({ scrollTrigger: { trigger: panel, start: "clamp(bottom bottom)", end: () => `+=${innerHeight}`, pin: panel, pinSpacing: false, scrub: true, invalidateOnRefresh: true, refreshPriority: 20-index } })
          .to(surface,{scale:.7,opacity:.5,duration:.9,ease:"none"})
          .to(surface,{opacity:0,duration:.1,ease:"none"});
      });
    });
    return () => media.revert();
  }, { scope: root });

  useGSAP(() => {
    if (fieldDescription === undefined) return;
    let disposed = false;
    const media = gsap.matchMedia();
    document.fonts.ready.then(() => {
      if (disposed || !root.current) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-description-track]")!;
        const panel = track.querySelector<HTMLElement>("[data-description-panel]")!;
        const surface = panel.firstElementChild!;
        const texts = Array.from(panel.querySelectorAll<HTMLElement>("[data-description-lines]"));
        const lines = new Map<HTMLElement, Element[]>();
        let reveal: gsap.core.Timeline | undefined;
        let revealProgress = 0;
        const holdDistance = () => innerHeight * 1.2;
        const measure = () => { track.style.paddingBottom = `${holdDistance()}px`; };
        measure();
        ScrollTrigger.addEventListener("refreshInit", measure);
        const rebuild = () => {
          if (lines.size !== texts.length) return;
          reveal?.kill();
          reveal = gsap.timeline({ paused: true });
          texts.forEach(text => {
            reveal!.fromTo(lines.get(text)!, {
              rotationX: -100, transformOrigin: "50% 50% -160px", opacity: 0,
            }, { rotationX: 0, opacity: 1, duration: .8, stagger: .25, ease: "power3.out" });
          });
          // Leave a short reading interval before the panel starts its exit.
          reveal.to({}, { duration: .4 }).progress(revealProgress);
        };
        const splits = texts.map(text => SplitText.create(text, {
          type: "lines", autoSplit: true, aria: "auto",
          onSplit: instance => { lines.set(text, instance.lines); rebuild(); },
        }));
        const exit = gsap.timeline({ paused: true })
          .to(surface, { scale: .7, opacity: .5, duration: .9, ease: "none" })
          .to(surface, { opacity: 0, duration: .1, ease: "none" });
        const update = (self: ScrollTrigger) => {
          const elapsed = self.progress * (self.end - self.start);
          revealProgress = gsap.utils.clamp(0, 1, elapsed / holdDistance());
          reveal?.progress(revealProgress);
          exit.progress(gsap.utils.clamp(0, 1, (elapsed - holdDistance()) / innerHeight));
        };
        const trigger = ScrollTrigger.create({
          trigger: panel, start: "clamp(bottom bottom)", end: () => `+=${holdDistance() + innerHeight}`,
          pin: panel, pinSpacing: false, invalidateOnRefresh: true, refreshPriority: 18,
          onUpdate: update, onRefresh: update,
        });
        return () => {
          trigger.kill(); reveal?.kill(); exit.kill();
          splits.forEach(split => split.revert());
          ScrollTrigger.removeEventListener("refreshInit", measure);
          track.style.removeProperty("padding-bottom");
        };
      });
      ScrollTrigger.refresh();
    });
    return () => { disposed = true; media.revert(); };
  }, { scope: root, dependencies: [fieldDescription], revertOnUpdate: true });

  const explorePrograms = contextSafe((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(activityId);
    if (!target) return;
    event.preventDefault();
    gsap.to(window, { scrollTo: { y: target, autoKill: true }, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1.3, ease: "power3.inOut", overwrite: "auto", onComplete: () => {
      window.history.replaceState(null, "", `#${activityId}`); target.focus({ preventScroll: true });
    } });
  });

  return <div ref={root} className={s.page}>
    <div data-profile-panel className={s.panel}>
    <section data-tone="cream" className={s.hero} aria-labelledby="dept-title">
      <div data-orbit className={s.orbit} aria-hidden><span/><span/><span/></div>
      <p data-intro className={s.eyebrow}>{settings?.kabinetNama || "Kabinet Arkhasena"}{settings?.kabinetPeriode && <> <span> / </span> {settings.kabinetPeriode}</>}</p>
      <h1 data-intro id="dept-title" className={`${s.title} ${data.abbr.length > 10 ? s.longTitle : ""}`}>{data.abbr}</h1>
      {data.fullName && <p data-intro className={s.fullName}>{data.fullName}</p>}
      <p data-intro className={s.description}>{data.description || `Kenali program kerja dan pengurus ${data.abbr}.`}</p>
      <a data-intro className={s.scroll} href={`#${activityId}`} onClick={explorePrograms}><span>Lihat Selengkapnya <ArrowDown size={20}/></span></a>
    </section>
    </div>
    {data.imageUrl && <div data-profile-panel className={s.panel}><div className={s.teamImage}><Image src={data.imageUrl} alt={`Kebersamaan ${data.abbr}`} fill sizes="100vw" priority /></div></div>}
    {fieldDescription !== undefined ? <div data-description-track id={activityId} className={s.panel} tabIndex={-1}>
      <div data-description-panel className={s.panel}>
      <section data-tone="green" className={s.fieldDescription} aria-labelledby="field-description-title">
        <h2 data-description-lines id="field-description-title">Deskripsi Bidang</h2>
        <p data-description-lines>{fieldDescription}</p>
      </section>
      </div>
    </div> : <ScrollGallery id={activityId} title="Program Kerja" items={programCards} count={programs.length} tone="green"/>}
    <ScrollGallery id="pengurus" title="Pengurus" items={peopleCards} tone="cream" last={!children}/>
    {children}
  </div>;
}

export default function DepartmentProfile({ slug }: { slug: string }) {
  const { data, isPending, isError, refetch } = useDepartemenBySlug(slug);
  if (isPending) return <div data-tone="cream" className={s.status} role="status"><p>Menyiapkan cerita kepengurusan…</p></div>;
  if (isError) return <div data-tone="cream" className={s.status}><h1>Halaman belum dapat dimuat.</h1><button onClick={()=>refetch()}>Coba lagi</button><Link href="/tentang#kabinet-sr">Kembali ke kabinet</Link></div>;
  if (!data && !reservedDepartments[slug]) notFound();
  const department = data || previewDepartment(slug);
  return <ProfileContent key={JSON.stringify(department)} data={department}/>;
}
