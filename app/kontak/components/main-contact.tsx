"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type PointerEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle, Paperclip, Plus, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import home from "@/app/(home)/components/sr-home.module.css";
import ContactSuccess from "./contact-success";
import s from "./contact.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const subjects = [
  { name: "Kerja sama", hint: "Ceritakan ide kolaborasi, bentuk kerja sama, dan waktu pelaksanaannya." },
  { name: "Media partner", hint: "Ceritakan acara Anda, tanggal pelaksanaan, serta bentuk publikasi yang dibutuhkan." },
  { name: "Undangan tampil", hint: "Ceritakan konsep acara, lokasi, tanggal, dan bidang Seni Religi yang ingin diundang." },
  { name: "Pertanyaan umum", hint: "Apa yang ingin Anda ketahui tentang Seni Religi? Kami siap mendengarkan." },
];

export default function MainContactSection() {
  const root = useRef<HTMLElement>(null);
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [subject, setSubject] = useState("");

  // Keep reveal positions in sync with the attachment list and submission state.
  useEffect(() => { ScrollTrigger.refresh(); }, [files, fileError, sent, sendError]);

  const { contextSafe } = useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-contact-title]", { yPercent: 110, rotation: 3, duration: 1.15, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-contact-reveal]").forEach(element => {
        gsap.from(element, { y: 32, autoAlpha: 0, duration: .85, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 94%", once: true } });
      });
    });
    return () => media.revert();
  }, { scope: root });

  const moveButton = contextSafe((event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(event.currentTarget, { x: (event.clientX - rect.left - rect.width / 2) * .15,
      y: (event.clientY - rect.top - rect.height / 2) * .25, duration: .4, ease: "power3.out", overwrite: "auto" });
  });
  const resetButton = contextSafe((event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    gsap.to(event.currentTarget, { x: 0, y: 0, duration: .8, ease: "elastic.out(1,.45)", overwrite: "auto" });
  });

  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    const next = [...files];
    for (const file of selected) {
      if (!next.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) next.push(file);
    }
    if (next.some(file => !/\.(pdf|docx?|txt|jpe?g|png|webp)$/i.test(file.name))) {
      setFileError("Gunakan berkas PDF, DOC, DOCX, TXT, JPG, PNG, atau WEBP.");
    } else if (next.length > 5 || next.reduce((total, file) => total + file.size, 0) > 3 * 1024 * 1024) {
      setFileError("Pilih maksimal 5 berkas dengan ukuran total hingga 3 MB.");
    } else {
      setFiles(next);
      setFileError("");
      submissionId.current = null;
    }
    event.target.value = "";
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    if (!subject) {
      setSendError("Pilih keperluan terlebih dahulu.");
      form.querySelector<HTMLButtonElement>("[data-subject]")?.focus();
      return;
    }
    const payload = new FormData(form);
    payload.set("subject", subject);
    files.forEach(file => payload.append("attachments", file));
    submissionId.current ??= crypto.randomUUID();
    submitting.current = true;
    setSending(true);
    setSendError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", body: payload,
        headers: { "Idempotency-Key": submissionId.current },
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        setSendError(result?.error || "Pesan belum dapat dikirim. Silakan coba lagi.");
        return;
      }
      setSent(true);
      form.reset();
      setFiles([]);
      setFileError("");
      setSubject("");
      submissionId.current = null;
    } catch {
      setSendError("Pengiriman belum dapat dikonfirmasi. Periksa koneksi Anda, lalu coba lagi. Isian Anda tetap tersimpan di halaman ini.");
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  return <section ref={root} className={s.page} data-tone="cream" aria-labelledby="contact-title">
    <header className={s.hero}>
      <h1 id="contact-title" className={s.title}>
        <span className={s.titleMask}><span data-contact-title>Hubungi Kami</span></span>
      </h1>
    </header>

    <form id="tulis-pesan" className={s.form} onSubmit={sendMessage} onChange={() => { submissionId.current = null; setSendError(""); }} aria-busy={sending}>
      <fieldset disabled={sending} className={s.formControls}>
      <div className={s.honeypot} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <fieldset className={s.subjects} data-contact-reveal>
        <legend>Saya ingin membahas...</legend>
        <div className={s.pills}>{subjects.map(item => <button type="button" key={item.name} className={`${s.pill} ${home.heroScroll}`} data-subject data-selected={subject === item.name || undefined} aria-pressed={subject === item.name} onClick={() => { setSubject(current => current === item.name ? "" : item.name); submissionId.current = null; setSendError(""); }} onPointerMove={moveButton} onPointerLeave={resetButton}>
          <span>{item.name}{subject === item.name ? <Check size={20} /> : <Plus size={20} />}</span>
        </button>)}</div>
      </fieldset>

      <div className={s.fields} data-contact-reveal>
        <h2 className={s.formHeading}>Mari berkenalan.</h2>
        <div className={s.fieldGrid}>
          <label className={s.field}>Nama lengkap <span>*</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Nama Anda" /></label>
          <label className={s.field}>Email <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="nama@email.com" /></label>
          <label className={`${s.field} ${s.fullWidth}`}>Instansi / komunitas <span className={s.optional}>(opsional)</span><input name="organization" autoComplete="organization" maxLength={160} placeholder="Dari mana cerita Anda bermula?" /></label>
        </div>
      </div>

      <div className={s.message} data-contact-reveal>
        <label className={s.formHeading} htmlFor="contact-message">Ceritakan kepada kami.</label>
        <p id="message-hint" className={s.messageHint} aria-live="polite">{subjects.find(item => item.name === subject)?.hint ?? "Bagikan ide, rencana, atau pertanyaan Anda. Kami senang mendengarnya."}</p>
        <textarea id="contact-message" name="message" required maxLength={4000} rows={3} aria-describedby="message-hint" placeholder="Halo Seni Religi, saya ingin..." />
      </div>

      <div className={s.attachments} data-contact-reveal>
        <input ref={fileInput} id="contact-files" className={s.fileInput} type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp" onChange={selectFiles} aria-label="Pilih berkas lampiran" aria-describedby="attachment-help attachment-error" />
        <button type="button" className={s.attachButton} onClick={() => fileInput.current?.click()}><Paperclip size={21} /> Tambahkan lampiran <span>(opsional)</span></button>
        <p id="attachment-help">Maksimal 5 berkas, total 3 MB. PDF, dokumen, atau gambar.</p>
        <p id="attachment-error" role="status" className={s.fileError}>{fileError}</p>
        {files.length > 0 && <ul className={s.fileList}>{files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${file.size}`}>
          <Paperclip size={16} aria-hidden="true" /><span>{file.name}<small>{file.size < 1024 * 1024 ? `${Math.ceil(file.size / 1024)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`}</small></span>
          <button type="button" aria-label={`Hapus ${file.name}`} onClick={() => { setFiles(current => current.filter((_, i) => i !== index)); submissionId.current = null; setFileError(""); }}><X size={18}/></button>
        </li>)}</ul>}
      </div>

      <div className={s.sendRow} data-contact-reveal>
        <button type="submit" className={s.sendButton} onPointerMove={moveButton} onPointerLeave={resetButton}><span>{sending ? "Mengirim..." : "Kirim request"}{sending ? <LoaderCircle className={s.spinner} size={24} /> : <ArrowUpRight size={24} />}</span></button>
      </div>
      </fieldset>
      {sendError && <p className={s.sendError} role="alert">{sendError}</p>}
    </form>
    {sent && <ContactSuccess onClose={() => setSent(false)} />}

  </section>;
}
