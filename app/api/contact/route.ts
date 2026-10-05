import nodemailer from "nodemailer";
import { createHash } from "node:crypto";

const recipient = "senireligi@ub.ac.id";
const maxBody = 4 * 1024 * 1024;
const maxFiles = 3 * 1024 * 1024;
const subjects = new Set(["Kerja sama", "Media partner", "Undangan tampil", "Pertanyaan umum"]);
const extension = /\.(pdf|docx?|txt|jpe?g|png|webp)$/i;
const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
// Best-effort per-process protection; production proxies must also rate-limit this route.
const attempts = new Map<string, { count: number; expires: number }>();
const receipts = new Map<string, { fingerprint: string; expires: number; result: Promise<boolean> }>();

function failure(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return failure("Permintaan tidak diizinkan.", 403);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data;")) return failure("Format pesan tidak valid.", 415);
  if (Number(request.headers.get("content-length")) > maxBody) return failure("Ukuran pesan terlalu besar.", 413);
  const id = request.headers.get("idempotency-key") ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return failure("Muat ulang halaman sebelum mengirim pesan.");

  const host = process.env.CONTACT_SMTP_HOST;
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASSWORD;
  const from = process.env.CONTACT_FROM;
  const port = Number(process.env.CONTACT_SMTP_PORT || "587");
  if (!host || !user || !pass || !from || !emailPattern.test(from) || ![465, 587].includes(port)) {
    return failure("Formulir sedang disiapkan. Silakan hubungi senireligi@ub.ac.id secara langsung.", 503);
  }

  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  for (const [key, value] of receipts) if (value.expires <= now) receipts.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const client = createHash("sha256").update(ip).digest("hex");
  const rate = attempts.get(client) ?? { count: 0, expires: now + 600000 };
  if (rate.count >= 10 || attempts.size >= 5000) return failure("Terlalu banyak percobaan. Silakan coba lagi dalam 10 menit.", 429);
  rate.count++;
  attempts.set(client, rate);

  let form: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) return failure("Pesan kosong.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBody) { await reader.cancel(); return failure("Ukuran pesan terlalu besar.", 413); }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": contentType } }).formData();
  } catch { return failure("Pesan tidak dapat dibaca. Silakan coba lagi."); }

  const field = (key: string) => { const value = form.get(key); return typeof value === "string" ? value.trim() : ""; };
  const name = field("name");
  const email = field("email");
  const organization = field("organization");
  const subject = field("subject");
  const message = field("message");
  if (field("website")) return failure("Permintaan tidak valid.");
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 200 || organization.length > 160 || !subjects.has(subject) || !message || message.length > 4000 || /[\r\n]/.test(name + email + organization)) {
    return failure("Periksa nama, email, keperluan, dan isi pesan Anda.");
  }
  const files = form.getAll("attachments");
  if (files.length > 5 || files.some(file => typeof file === "string" || !extension.test(file.name) || file.name.length > 180 || /[\r\n]/.test(file.name))) {
    return failure("Pilih maksimal 5 lampiran berupa PDF, dokumen, atau gambar.");
  }
  const uploads = files as File[];
  if (uploads.reduce((sum, file) => sum + file.size, 0) > maxFiles) return failure("Ukuran total lampiran maksimal 3 MB.", 413);
  const attachments = await Promise.all(uploads.map(async file => ({ filename: file.name.replace(/[\\/]/g, "_"), content: Buffer.from(await file.arrayBuffer()) })));
  const text = `Keperluan: ${subject}\nNama: ${name}\nEmail: ${email}\nInstansi / komunitas: ${organization || "—"}\n\n${message}`;
  const digest = createHash("sha256").update(text);
  for (const attachment of attachments) digest.update(attachment.filename).update(attachment.content);
  const fingerprint = digest.digest("hex");
  const existing = receipts.get(id);
  if (existing && existing.fingerprint !== fingerprint) return failure("Isian berubah. Silakan kirim kembali.", 409);
  if (!existing && receipts.size >= 5000) return failure("Layanan sedang sibuk. Silakan coba lagi nanti.", 503);

  const send = async () => {
    const transport = nodemailer.createTransport({
      host, port, secure: port === 465, requireTLS: true, auth: { user, pass },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
      disableFileAccess: true, disableUrlAccess: true,
    });
    try {
      const result = await transport.sendMail({
        from: { name: "Website Seni Religi", address: from }, to: recipient,
        replyTo: { name, address: email }, subject: `[Hubungi Kami] ${subject} — ${name}`,
        messageId: `<contact-${id}@${from.split("@")[1]}>`, text, attachments,
      });
      return result.accepted.some(address => address.toLowerCase() === recipient);
    } catch { return false; }
    finally { transport.close(); }
  };
  const result = existing?.result ?? send();
  if (!existing) receipts.set(id, { fingerprint, expires: now + 86400000, result });
  if (!await result) {
    receipts.delete(id);
    return failure("Pengiriman belum dapat dikonfirmasi. Coba lagi nanti atau hubungi senireligi@ub.ac.id.", 502);
  }
  return Response.json({ ok: true });
}
