"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { ParticleSignature } from "@/components/brand/particle-signature";
import s from "@/styles/experience.module.scss";
import f from "@/components/layout/footer.module.scss";

function LegalDialog({ kind, close }: { kind: "privacy" | "terms"; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const modal = dialog.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.documentElement.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={f.dialog}
      aria-labelledby="footer-legal-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div>
        <button className={f.close} aria-label="Tutup informasi" onClick={close}>
          <X size={22} />
        </button>
        <h2 id="footer-legal-title">
          {kind === "privacy" ? "Kebijakan Privasi" : "Ketentuan Penggunaan"}
        </h2>
        <p>
          {kind === "privacy"
            ? "Nama, email, instansi (jika diisi), dan pesan pada formulir kontak digunakan untuk menanggapi permintaan Anda melalui email."
            : "Website ini memuat informasi, karya, dan kegiatan Seni Religi Universitas Brawijaya."}
        </p>
        {kind === "privacy" && (
          <p>
            Gambar dan video menggunakan layanan pihak ketiga, termasuk Sanity dan YouTube jika
            video YouTube tersedia. Media dapat dimuat otomatis ketika mendekati area tampilan,
            sebelum tombol putar ditekan.
          </p>
        )}
        <p>
          Rincian masa penyimpanan data, penghapusan data, dan dokumen resmi masih perlu dilengkapi
          oleh pengelola sebelum publikasi. Hubungi pengelola untuk informasi lebih lanjut.
        </p>
        <Link href="/kontak" onClick={close}>
          Hubungi pengelola <ArrowUpRight size={18} />
        </Link>
      </div>
    </dialog>
  );
}

/** Shared by the homepage and every public page layout. */
export default function Footer({ wave = true }: { wave?: boolean }) {
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);
  const socials = [
    ["Instagram", "https://www.instagram.com/senireligi_ub/"],
    ["YouTube", "https://www.youtube.com/@SeniReligiUB"],
  ];
  return (
    <footer data-tone="green" data-wave={wave || undefined} className={`${s.footer} ${f.root}`}>
      <div className={s.footerInfo}>
        <Link className={s.brand} href="/">
          <Image src="/logo.png" alt="" width={38} height={43} />
          <span>
            SENI RELIGI<small>UNIVERSITAS BRAWIJAYA</small>
          </span>
        </Link>
        <p>
          Malang, Jawa Timur
          <br />
          Indonesia
        </p>
        <div>
          {socials.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer">
              {name}
              <ArrowUpRight size={14} />
            </a>
          ))}
          <Link href="/kontak">
            Kontak
            <ArrowUpRight size={14} />
          </Link>
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
