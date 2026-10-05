"use client";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CONTACT_FILE_EXTENSION, CONTACT_LIMITS } from "../lib/contact-config";
export function useContactForm() {
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [subject, setSubject] = useState("");

  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    const next = [...files];
    for (const file of selected) {
      if (
        !next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        )
      )
        next.push(file);
    }
    if (next.some((file) => !CONTACT_FILE_EXTENSION.test(file.name))) {
      setFileError("Gunakan berkas PDF, DOC, DOCX, TXT, JPG, PNG, atau WEBP.");
    } else if (
      next.length > CONTACT_LIMITS.files ||
      next.reduce((total, file) => total + file.size, 0) > CONTACT_LIMITS.attachmentBytes
    ) {
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
    files.forEach((file) => payload.append("attachments", file));
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
      setFiles([]);
      setFileError("");
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
  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    submissionId.current = null;
    setFileError("");
  };
  return {
    files,
    fileError,
    sending,
    sent,
    sendError,
    subject,
    fileInput,
    setSent,
    selectFiles,
    sendMessage,
    markChanged,
    toggleSubject,
    removeFile,
  };
}
