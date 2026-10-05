"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import s from "@/app/(home)/components/sr-home.module.css";
import shared from "./site-header.module.css";

gsap.registerPlugin(useGSAP);
const nav = [
  ["Beranda", "/#main-content"],
  ["Tentang kami", "/tentang"],
  ["Berita & acara", "/aktivitas"],
  ["Prestasi", "/prestasi"],
  ["Hubungi kami", "/kontak"],
];

export default function SiteHeader() {
  const root = useRef<HTMLDivElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 600px)",
        },
        (context) => {
          const duration = context.conditions?.motion ? 0.7 : 0.01;
          timeline.current = gsap
            .timeline({ paused: true })
            .to(
              "[data-menu-backdrop]",
              { autoAlpha: 1, duration: duration * 0.5 },
              0,
            )
            .fromTo(
              "[data-menu-panel]",
              { autoAlpha: 0, y: -28, scaleY: 0.8 },
              {
                autoAlpha: 1,
                y: 0,
                scaleY: 1,
                duration,
                ease: "back.out(1.8)",
                easeReverse: "power3.out",
              },
              0.08,
            )
            .fromTo(
              "[data-menu-link]",
              { opacity: 0, y: -18 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.035,
                duration: duration * 0.5,
                easeReverse: "power2.out",
              },
              0.18,
            )
            .to(
              "[data-bar-top]",
              {
                attr: { x1: 4, y1: 4, x2: 20, y2: 20 },
                duration: duration * 0.4,
              },
              0,
            )
            .to(
              "[data-bar-bottom]",
              {
                attr: { x1: 20, y1: 4, x2: 4, y2: 20 },
                duration: duration * 0.4,
              },
              0,
            );
          if (opened.current) timeline.current.progress(1);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    opened.current = open;
    const tl = timeline.current;
    if (open) tl?.timeScale(1).play();
    else tl?.timeScale(1.5).reverse();
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const list = Array.from(
          root.current!.querySelectorAll<HTMLElement>(
            "button, a[data-menu-link]",
          ),
        );
        const index = list.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index <= 0) {
          e.preventDefault();
          list.at(-1)?.focus();
        } else if (!e.shiftKey && index === list.length - 1) {
          e.preventDefault();
          list[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className={`${s.navigation} ${shared.root}`}
      role={open ? "dialog" : undefined}
      aria-modal={open || undefined}
      aria-label={open ? "Menu Seni Religi" : undefined}
    >
      <div
        data-menu-backdrop
        className={s.menuBackdrop}
        onClick={() => setOpen(false)}
        style={{ pointerEvents: open ? "auto" : "none" }}
      />
      <header data-island className={s.island}>
        <Link
          href="/"
          className={s.islandBrand}
          data-island-brand
          onClick={() => setOpen(false)}
          aria-label="Seni Religi — Beranda"
        >
          <Image src="/logo.png" alt="" width={34} height={34} />
          <b>
            Seni Religi<span>Universitas Brawijaya</span>
          </b>
        </Link>
        <div className={s.islandButtons}>
          <button
            ref={toggle}
            className={`${s.iconButton} ${s.menuButton}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="sr-navigation"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line data-bar-top x1="3" y1="8" x2="21" y2="8" />
              <line data-bar-bottom x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </button>
        </div>
      </header>
      <div className={s.menuAnchor}>
        <nav
          data-menu-panel
          id="sr-navigation"
          className={s.menuPanel}
          aria-label="Navigasi utama"
          inert={!open}
        >
          <span className={s.menuCaption}>TEMUKAN RUANGMU</span>
          {nav.map(([label, href], i) => (
            <Link
              data-menu-link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {label}
              <small>0{i + 1}</small>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}


