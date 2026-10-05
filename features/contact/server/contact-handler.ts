import { createHash } from "node:crypto";
import { CONTACT_LIMITS } from "../lib/contact-config";
import type { ContactMailer } from "./contact-mailer";
import { parseContact } from "./parse-contact";
import { failure } from "./response";

const maxBody = CONTACT_LIMITS.bodyBytes;

export function createContactHandler(getMailer: () => ContactMailer | null) {
  // Best-effort per-process protection; production proxies must also rate-limit this route.
  const attempts = new Map<string, { count: number; expires: number }>();
  const receipts = new Map<
    string,
    { fingerprint: string; expires: number; result: Promise<boolean> }
  >();

  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      return failure("Permintaan tidak diizinkan.", 403);
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.startsWith("multipart/form-data;"))
      return failure("Format pesan tidak valid.", 415);
    if (Number(request.headers.get("content-length")) > maxBody)
      return failure("Ukuran pesan terlalu besar.", 413);
    const id = request.headers.get("idempotency-key") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
      return failure("Muat ulang halaman sebelum mengirim pesan.");

    const mailer = getMailer();
    if (!mailer)
      return failure(
        "Formulir sedang disiapkan. Silakan hubungi senireligi@ub.ac.id secara langsung.",
        503,
      );

    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    for (const [key, value] of receipts) if (value.expires <= now) receipts.delete(key);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const client = createHash("sha256").update(ip).digest("hex");
    const rate = attempts.get(client) ?? { count: 0, expires: now + 600000 };
    if (rate.count >= 10 || attempts.size >= 5000)
      return failure("Terlalu banyak percobaan. Silakan coba lagi dalam 10 menit.", 429);
    rate.count++;
    attempts.set(client, rate);

    const parsed = await parseContact(request, contentType);
    if (parsed instanceof Response) return parsed;
    const { text, attachments } = parsed;
    const digest = createHash("sha256").update(text);
    for (const attachment of attachments)
      digest.update(attachment.filename).update(attachment.content);
    const fingerprint = digest.digest("hex");
    const existing = receipts.get(id);
    if (existing && existing.fingerprint !== fingerprint)
      return failure("Isian berubah. Silakan kirim kembali.", 409);
    if (!existing && receipts.size >= 5000)
      return failure("Layanan sedang sibuk. Silakan coba lagi nanti.", 503);

    const result = existing?.result ?? mailer.send(parsed, id);
    if (!existing) receipts.set(id, { fingerprint, expires: now + 86400000, result });
    if (!(await result)) {
      receipts.delete(id);
      return failure(
        "Pengiriman belum dapat dikonfirmasi. Coba lagi nanti atau hubungi senireligi@ub.ac.id.",
        502,
      );
    }
    return Response.json({ ok: true });
  };
}
