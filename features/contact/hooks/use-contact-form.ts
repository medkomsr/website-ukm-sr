"use client";
import { useRef, useState, type FormEvent } from "react";
export function useContactForm() {
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [subject, setSubject] = useState("");

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
    sent,
    sendError,
    subject,
    setSent,
    sendMessage,
    markChanged,
    toggleSubject,
  };
}
