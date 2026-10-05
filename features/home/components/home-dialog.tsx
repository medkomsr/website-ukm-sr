"use client";
import s from "@/styles/experience.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { TextLink } from "./section-heading";
gsap.registerPlugin(useGSAP);
export type Popup = { kind: "video" | "privacy" | "terms" };

function videoSource(url?: string) {
  if (!url) return null;
  try {
    const p = new URL(url);
    if (p.protocol !== "https:") return null;
    const host = p.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? p.pathname.slice(1)
        : ["youtube.com", "m.youtube.com"].includes(host)
          ? p.searchParams.get("v") || p.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
          : null;
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id))
      return {
        kind: "embed",
        url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
      };
    if (/\.mp4$/i.test(p.pathname)) return { kind: "video", url };
  } catch {
    return null;
  }
  return null;
}

export function PopupDialog({
  popup,
  close,
  videoUrl,
}: {
  popup: Popup;
  close: () => void;
  videoUrl?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { contextSafe } = useGSAP(
    () => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.from(`.${s.dialogContent}`, {
          y: 28,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        });
    },
    { scope: ref },
  );
  const closeAnimated = contextSafe(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) close();
    else
      gsap.to(`.${s.dialogContent}`, {
        y: 15,
        opacity: 0,
        duration: 0.2,
        onComplete: close,
      });
  });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const video = videoSource(videoUrl);
  return (
    <dialog
      ref={ref}
      className={s.dialog}
      onCancel={(e) => {
        e.preventDefault();
        closeAnimated();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAnimated();
      }}
      aria-labelledby="popup-title"
    >
      <div className={s.dialogContent}>
        <button
          autoFocus
          className={s.closeDialog}
          aria-label="Tutup dialog"
          onClick={closeAnimated}
        >
          <X />
        </button>
        {popup.kind === "video" ? (
          <>
            <h2 id="popup-title">Seni Religi — Company profile</h2>
            {video ? (
              video.kind === "embed" ? (
                <iframe
                  title="Video company profile Seni Religi"
                  src={video.url}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video src={video.url} controls autoPlay playsInline />
              )
            ) : (
              <div className={s.videoEmpty}>
                <Image src="/logo.png" width={65} height={72} alt="" />
                <p>
                  Video resmi belum ditambahkan.
                  <br />
                  Sementara itu, kenali keluarga Seni Religi.
                </p>
                <TextLink href="/tentang">Tentang kami</TextLink>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 id="popup-title">
              {popup.kind === "privacy" ? "Kebijakan Privasi" : "Ketentuan Penggunaan"}
            </h2>
            <p>
              {popup.kind === "privacy"
                ? "Video YouTube, ketika diputar, dimuat melalui layanan pihak ketiga."
                : "Website ini memuat informasi, karya, dan kegiatan Seni Religi Universitas Brawijaya."}
            </p>
            <p>Dokumen resmi akan dilengkapi oleh pengelola SR sebelum publikasi website.</p>
            <TextLink href="/kontak">Hubungi pengelola</TextLink>
          </>
        )}
      </div>
    </dialog>
  );
}
