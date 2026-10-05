"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Motto } from "@/features/home/components/motto";
import { HeroScrollButton, HeroWordmark } from "@/features/home/components/hero-wordmark";
import { CompanyReel } from "@/features/home/components/company-reel";
import { useHomeMotion } from "@/features/home/hooks/use-home-motion";
import { useAktivitas } from "@/hooks/content/use-aktivitas";
import { usePrestasi } from "@/hooks/content/use-prestasi";
import { useHomePage } from "@/hooks/content/use-home-page";

import { IMAGES } from "@/lib/constants/home-content";
import Footer from "@/components/layout/footer";
import SiteHeader from "@/components/layout/site-header";
import s from "@/styles/experience.module.scss";

import { Achievements } from "./achievements";
import { Fields } from "./fields";
import { PopupDialog, type Popup } from "./home-dialog";
import { NewsGallery } from "./news-gallery";
import { SectionTitle } from "./section-heading";
gsap.registerPlugin(ScrollTrigger);

export default function SrHome() {
  const root = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<Popup | null>(null);
  const { data: home } = useHomePage();

  const activities = useAktivitas(),
    achievements = usePrestasi();
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    return () => {
      disposed = true;
    };
  }, []);
  useHomeMotion(root, activities.data?.length ?? 0);
  const all = activities.data ?? [];
  return (
    <div ref={root} className={s.site}>
      <a href="#main-content" className={s.skip}>
        Lewati ke kontend
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section data-tone="cream" className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroMain}>
            <HeroWordmark />
          </div>
          <div className={s.heroBottom}>
            <HeroScrollButton />
          </div>
        </section>
        <Motto />
        <CompanyReel
          poster={home?.companyVideoPosterUrl || IMAGES.stage}
          onPlay={() => setPopup({ kind: "video" })}
        />
        <NewsGallery
          id="projects"
          items={all}
          loading={activities.isLoading}
          error={activities.isError}
          title="Berita & Acara"
        />
        <Fields />
        {!!home?.partners?.length && (
          <section data-tone="green" data-wave id="partners" className={s.section}>
            <SectionTitle number="+" label="TUMBUH BERSAMA" title="Ruang untuk berkolaborasi." />
            <div className={s.partnerGrid}>
              {home.partners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url || "/kontak"}
                  className={s.partner}
                  target={partner.url ? "_blank" : undefined}
                  rel={partner.url ? "noreferrer" : undefined}
                >
                  {partner.logoUrl ? (
                    <Image src={partner.logoUrl} alt={partner.name} width={180} height={90} />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}
        <Achievements
          tone={home?.partners?.length ? "cream" : "green"}
          items={achievements.data ?? []}
          loading={achievements.isLoading}
          error={achievements.isError}
        />
        <section
          data-tone={home?.partners?.length ? "green" : "cream"}
          data-wave
          id="contact"
          className={`${s.section} ${s.contact}`}
        >
          <h2>
            Ada ide?
            <br />
            Mari <em>bertemu.</em>
            <button
              data-contact-play
              className={s.contactPlay}
              aria-label="Animasikan logo Seni Religi"
            >
              <Image
                src="/logo.png"
                alt="Logo Seni Religi Universitas Brawijaya"
                width={220}
                height={220}
              />
            </button>
          </h2>
          <div>
            <p>
              Untuk berkarya, berkolaborasi,
              <br />
              atau sekadar mengenal lebih dekat.
            </p>
            <Link href="/kontak" className={s.pillCta}>
              Mulai percakapan
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      {popup && (
        <PopupDialog popup={popup} close={() => setPopup(null)} videoUrl={home?.companyVideoUrl} />
      )}
    </div>
  );
}
