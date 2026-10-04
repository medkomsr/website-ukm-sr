"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ParticleSignature } from "@/app/(home)/components/particle-signature";
import s from "@/app/(home)/components/sr-home.module.css";
import f from "./footer.module.css";

function LegalDialog({ kind, close }: { kind: "privacy" | "terms"; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => previous?.focus({ preventScroll: true });
  }, []);
  return (
    <dialog ref={dialog} className={f.dialog} aria-labelledby="footer-legal-title" onCancel={close}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div>
        <button className={f.close} aria-label="Tutup informasi" onClick={close}><X size={22} /></button>
        <h2 id="footer-legal-title">{kind === "privacy" ? "Kebijakan Privasi" : "Ketentuan Penggunaan"}</h2>
        <p>{kind === "privacy" ? "Video YouTube, ketika diputar, dimuat melalui layanan pihak ketiga." : "Website ini memuat informasi, karya, dan kegiatan Seni Religi Universitas Brawijaya."}</p>
        <p>Dokumen resmi akan dilengkapi oleh pengelola SR sebelum publikasi website.</p>
        <Link href="/kontak" onClick={close}>Hubungi pengelola <ArrowUpRight size={18} /></Link>
      </div>
    </dialog>
  );
}

/** Shared by the homepage and every public page layout. */
export default function Footer({ wave = true }: { wave?: boolean }) {
  const { data: settings } = useSiteSettings();
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);
  const socials = [["Instagram", settings?.instagramUrl], ["YouTube", settings?.youtubeUrl]]
    .filter(([, url]) => url && /^https?:\/\//.test(url));
  return (
    <footer data-tone="green" data-wave={wave || undefined} className={`${s.footer} ${f.root}`}>
      <div className={s.footerInfo}>
        <Link className={s.brand} href="/">
          <Image src="/logo.png" alt="" width={38} height={43} />
          <span>SENI RELIGI<small>UNIVERSITAS BRAWIJAYA</small></span>
        </Link>
        <p>Malang, Jawa Timur<br />Indonesia</p>
        <div>
          {socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={14} /></a>)}
          <Link href="/kontak">Kontak<ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <ParticleSignature />
      <div className={s.legal}>
        <span>© {new Date().getFullYear()} Seni Religi Universitas Brawijaya.</span>
        <div>
          <button onClick={() => setLegal("privacy")}>Privasi</button>
          <button onClick={() => setLegal("terms")}>Ketentuan</button>
        </div>
      </div>
      {legal && <LegalDialog kind={legal} close={() => setLegal(null)} />}
    </footer>
  );
}
