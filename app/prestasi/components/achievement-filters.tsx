"use client";
import { useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import n from "@/app/aktivitas/components/newsroom.module.css";
import s from "./achievements.module.css";

gsap.registerPlugin(useGSAP,ScrollTrigger);
type Values = {year:string;field:string;category:string;search:string};
export default function AchievementFilters({values,years,fields,categories,count,onChange}:{values:Values;years:number[];fields:string[];categories:string[];count:number;onChange:(next:Values)=>void}) {
  const root=useRef<HTMLDivElement>(null);
  const panel=useRef<HTMLDivElement>(null);
  const [expanded,setExpanded]=useState(false);
  const hasFilters=values.year!=="all"||values.field!=="all"||values.category!=="all"||!!values.search;
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)",()=>{
      const mobile=matchMedia("(max-width:700px)").matches;
      gsap.from("[data-filter-pop]",{opacity:0,y:mobile?0:28,scale:mobile?1:.94,duration:.6,stagger:.09,ease:mobile?"power2.out":"back.out(1.35)",scrollTrigger:{trigger:root.current,start:"top 92%",once:true}});
    });
    return ()=>media.revert();
  },{scope:root});
  useGSAP(()=>{
    const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
    gsap.to(panel.current,{height:expanded?"auto":0,opacity:expanded?1:0,duration:reduced?0:.45,ease:"power3.inOut",onComplete:()=>ScrollTrigger.refresh()});
  },{scope:root,dependencies:[expanded]});
  const update=(part:Partial<Values>)=>onChange({...values,...part});
  const reset=()=>onChange({year:"all",field:"all",category:"all",search:""});
  return <div ref={root} className={s.archiveControls}>
    <div className={n.toolbar}>
      <div className={n.tabs} role="group" aria-label="Kategori prestasi">{["all",...categories].map(category=>{
        const label=category==="all"?"Semua":category;
        return <label data-filter-pop key={category} className={n.tagButton}><input type="radio" name="achievement-category" checked={values.category===category} onChange={()=>update({category})}/><span>{label}</span><span className={n.checked} aria-hidden="true">{label}</span></label>;
      })}</div>
      <div data-filter-pop className={n.search}><Search size={18}/><input aria-label="Cari prestasi atau peserta" placeholder="Cari prestasi atau peserta…" value={values.search} onChange={event=>update({search:event.target.value})}/>{values.search&&<button aria-label="Hapus pencarian" onClick={()=>update({search:""})}><X size={16}/></button>}</div>
      <button data-filter-pop className={n.filterButton} aria-expanded={expanded} aria-controls="achievement-filters" onClick={()=>setExpanded(!expanded)}><SlidersHorizontal size={17}/>Filter</button>
    </div>
    <div ref={panel} className={s.filterDrawer} inert={!expanded} aria-hidden={!expanded} id="achievement-filters"><div className={n.filters}>
      <label>Tahun<select value={values.year} onChange={event=>update({year:event.target.value})}><option value="all">Semua tahun</option>{years.map(year=><option key={year}>{year}</option>)}</select></label>
      <label>Bidang<select value={values.field} onChange={event=>update({field:event.target.value})}><option value="all">Semua bidang</option>{fields.map(field=><option key={field}>{field}</option>)}</select></label>
      {hasFilters&&<button className={n.reset} onClick={reset}>Reset filter <X size={14}/></button>}
    </div></div>
    <div data-filter-pop className={n.results} aria-live="polite">{count} prestasi ditemukan{hasFilters&&!expanded&&<button onClick={reset}>Reset filter <X size={12}/></button>}</div>
  </div>;
}
