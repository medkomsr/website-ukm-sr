"use client";
import { useRef, useState, type FormEvent } from "react";
import { CONTACT_FIELDS, validateContact, type ContactErrors } from "../lib/validate-contact";
export function useContactForm() {
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [subject, setSubject] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const payload = new FormData(form);
    payload.set("subject", subject);
    const validation = validateContact(payload);
    setErrors(validation.errors);
    if (!validation.valid) {
      const first = CONTACT_FIELDS.find((key) => validation.errors[key]);
      form
        .querySelector<HTMLElement>(first === "subject" ? "[data-subject]" : `[name="${first}"]`)
        ?.focus();
      return;
    }
    for (const key of CONTACT_FIELDS) payload.set(key, validation.values[key]);
    submissionId.current ??= crypto.randomUUID();
    submitting.current = true;
    setSending(true);
    setSendError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: payload,
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
      setSubject("");
      submissionId.current = null;
    } catch {
      setSendError(
        "Pengiriman belum dapat dikonfirmasi. Periksa koneksi Anda, lalu coba lagi. Isian Anda tetap tersimpan di halaman ini.",
      );
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  const markChanged = () => {
    submissionId.current = null;
    setSendError("");
  };
  const toggleSubject = (name: string) => {
    setSubject((current) => (current === name ? "" : name));
    markChanged();
  };
  return {
    sending,
    errors,
    sent,
    sendError,
    subject,
    setSent,
    sendMessage,
    markChanged,
    toggleSubject,
  };
}
