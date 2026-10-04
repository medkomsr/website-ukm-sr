"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, Sun, Moon } from "lucide-react";
import { useSiteTheme } from "@/hooks/useSiteTheme";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import styles from "./elegant-shell.module.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const links = [
  ["Tentang SR", "/tentang"],
  ["Aktivitas", "/aktivitas"],
  ["Prestasi", "/prestasi"],
  ["Galeri", "/galeri"],
  ["Katalog", "/katalog"],
] as const;

export function ElegantHeader() {
  const [dark, setDark] = useSiteTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!open || !panel.current) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(panel.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
          ease: "power3.inOut",
        });
        gsap.from(panel.current!.querySelectorAll("nav a"), {
          y: 24,
          opacity: 0,
          stagger: 0.045,
          duration: 0.5,
          delay: 0.2,
          ease: "power3.out",
        });
      });
      return () => media.revert();
    },
    { dependencies: [open], revertOnUpdate: true },
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = [
        toggle.current,
        ...Array.from(
          panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
        ),
      ].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <a className={styles.skip} href="#main-content">
        Lewati ke konten
      </a>
      <header className={styles.header}>
        <div
          data-scroll-progress
          aria-hidden="true"
          className={styles.scrollProgress}
        />
        <Link
          href="/"
          className={styles.brand}
          aria-label="Seni Religi — Beranda"
          onClick={() => setOpen(false)}
        >
          <Image src="/logo.png" alt="" width={43} height={43} />
          <span>
            Seni Religi<small>UNIVERSITAS BRAWIJAYA</small>
          </span>
        </Link>
        <nav className={styles.desktop} aria-label="Navigasi utama">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          className={styles.themeToggle}
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <Link href="/kontak" className={styles.contact}>
          Mari terhubung <ArrowUpRight size={15} />
        </Link>
        <button
          ref={toggle}
          className={styles.toggle}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="sr-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div ref={panel} id="sr-menu" className={styles.mobile}>
            <p>JELAJAHI SENI RELIGI</p>
            <nav aria-label="Navigasi seluler">
              {[["Beranda", "/"], ...links, ["Kontak", "/kontak"]].map(
                ([label, href], index) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)}>
                    <small>0{index + 1}</small>
                    {label}
                    <ArrowUpRight size={22} />
                  </Link>
                ),
              )}
            </nav>
            <span>Seni menyatukan. Religi menguatkan.</span>
          </div>
        )}
      </header>
    </>
  );
}

export function ElegantFooter() {
  const { data } = useSiteSettings();
  const socials = [
    ["Instagram", data?.instagramUrl],
    ["YouTube", data?.youtubeUrl],
  ].filter(([, url]) => url && /^https?:\/\//.test(url));
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div>
          <Link href="/" className={styles.footerBrand}>
            Seni Religi<span>UB</span>
          </Link>
          <p>
            Ruang untuk berkarya.
            <br />
            Tempat untuk bertumbuh bersama.
          </p>
        </div>
        <div>
          <span className={styles.label}>JELAJAHI</span>
          <nav aria-label="Navigasi footer">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <span className={styles.label}>TEMUKAN KAMI</span>
          <p>
            Universitas Brawijaya
            <br />
            Malang, Indonesia
          </p>
          <Link href="/kontak">
            Hubungi Seni Religi <ArrowUpRight size={14} />
          </Link>
          {socials.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer">
              {name} <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© Seni Religi Universitas Brawijaya</span>
        <span>Dari hati, menjadi karya.</span>
        <a href="#main-content">Kembali ke atas ↑</a>
      </div>
    </footer>
  );
}
