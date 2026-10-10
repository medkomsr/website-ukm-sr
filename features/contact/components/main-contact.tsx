"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Check, LoaderCircle, Plus } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import home from "@/styles/experience.module.scss";
import ContactSuccess from "./contact-success";
import s from "./contact.module.scss";

import { useContactForm } from "../hooks/use-contact-form";
import { useContactMotion } from "../hooks/use-contact-motion";
import { CONTACT_LIMITS, CONTACT_SUBJECTS as subjects } from "../lib/contact-config";

export default function MainContactSection() {
  const root = useRef<HTMLElement>(null);
  const { sending, sent, sendError, subject, setSent, sendMessage, markChanged, toggleSubject } =
    useContactForm();
  // Keep reveal positions in sync with submission feedback.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [sent, sendError]);

  const { moveButton, resetButton } = useContactMotion(root);
  return (
    <section ref={root} className={s.page} data-tone="cream" aria-labelledby="contact-title">
      <header className={s.hero}>
        <h1 id="contact-title" className={s.title}>
          <span className={s.titleMask}>
            <span data-contact-title>Hubungi Kami</span>
          </span>
        </h1>
      </header>

      <form
        id="tulis-pesan"
        className={s.form}
        onSubmit={sendMessage}
        onChange={markChanged}
        aria-busy={sending}
      >
        <fieldset disabled={sending} className={s.formControls}>
          <div className={s.honeypot} aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <fieldset className={s.subjects} data-contact-reveal>
            <legend>Saya ingin membahas...</legend>
            <div className={s.pills}>
              {subjects.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={`${s.pill} ${home.heroScroll}`}
                  data-subject
                  data-selected={subject === item.name || undefined}
                  aria-pressed={subject === item.name}
                  onClick={() => toggleSubject(item.name)}
                  onPointerMove={moveButton}
                  onPointerLeave={resetButton}
                >
                  <span>
                    {item.name}
                    {subject === item.name ? <Check size={20} /> : <Plus size={20} />}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className={s.fields} data-contact-reveal>
            <h2 className={s.formHeading}>Mari berkenalan.</h2>
            <div className={s.fieldGrid}>
              <label className={s.field}>
                Nama lengkap <span>*</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={CONTACT_LIMITS.name}
                  placeholder="Nama Anda"
                />
              </label>
              <label className={s.field}>
                Email <span>*</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={CONTACT_LIMITS.email}
                  placeholder="nama@email.com"
                />
              </label>
              <label className={`${s.field} ${s.fullWidth}`}>
                Instansi / komunitas <span className={s.optional}>(opsional)</span>
                <input
                  name="organization"
                  autoComplete="organization"
                  maxLength={CONTACT_LIMITS.organization}
                  placeholder="Dari mana cerita Anda bermula?"
                />
              </label>
            </div>
          </div>

          <div className={s.message} data-contact-reveal>
            <label className={s.formHeading} htmlFor="contact-message">
              Ceritakan kepada kami.
            </label>
            <p id="message-hint" className={s.messageHint} aria-live="polite">
              {subjects.find((item) => item.name === subject)?.hint ??
                "Bagikan ide, rencana, atau pertanyaan Anda. Kami senang mendengarnya."}
            </p>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={CONTACT_LIMITS.message}
              rows={3}
              aria-describedby="message-hint"
              placeholder="Halo Seni Religi, saya ingin..."
            />
          </div>

          <div className={s.sendRow} data-contact-reveal>
            <button
              type="submit"
              className={s.sendButton}
              onPointerMove={moveButton}
              onPointerLeave={resetButton}
            >
              <span>
                {sending ? "Mengirim..." : "Kirim request"}
                {sending ? (
                  <LoaderCircle className={s.spinner} size={24} />
                ) : (
                  <ArrowUpRight size={24} />
                )}
              </span>
            </button>
          </div>
        </fieldset>
        {sendError && (
          <p className={s.sendError} role="alert">
            {sendError}
          </p>
        )}
      </form>
      {sent && <ContactSuccess onClose={() => setSent(false)} />}
    </section>
  );
}
