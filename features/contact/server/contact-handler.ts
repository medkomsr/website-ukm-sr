import { createHash } from "node:crypto";
import { CONTACT_LIMITS } from "../lib/contact-config";
import type { ContactMailer } from "./contact-mailer";
import type { ContactStore } from "./contact-store";
import { parseContact } from "./parse-contact";
import { failure } from "./response";

export function createContactHandler(
  getMailer: () => ContactMailer | null,
  getStore: () => ContactStore | null,
) {
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      return failure("Permintaan tidak diizinkan.", 403);
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.startsWith("multipart/form-data;"))
      return failure("Format pesan tidak valid.", 415);
    if (Number(request.headers.get("content-length")) > CONTACT_LIMITS.bodyBytes)
      return failure("Ukuran pesan terlalu besar.", 413);
    const id = request.headers.get("idempotency-key") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
      return failure("Muat ulang halaman sebelum mengirim pesan.");
    const mailer = getMailer();
    const store = getStore();
    if (!mailer || !store)
      return failure(
        "Formulir belum aktif. Silakan hubungi senireligi@ub.ac.id secara langsung.",
        503,
      );
    // Vercel supplies this header. Other hosts must strip untrusted forwarded headers.
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
    if (!ip) return failure("Permintaan tidak dapat diverifikasi.", 400);
    const client = createHash("sha256").update(ip).digest("hex");
    try {
      if (!(await store.consume(client)))
        return failure("Terlalu banyak percobaan. Silakan coba lagi dalam 10 menit.", 429);
      const parsed = await parseContact(request, contentType);
      if (parsed instanceof Response) return parsed;
      const fingerprint = createHash("sha256").update(parsed.text).digest("hex");
      const state = await store.claim(id.toLowerCase(), fingerprint);
      if (state === "conflict") return failure("Isian berubah. Silakan kirim kembali.", 409);
      if (state === "sent") return Response.json({ ok: true });
      if (state === "pending")
        return failure(
          "Pesan masih diproses. Tunggu sebentar lalu periksa kembali dengan tombol kirim.",
          409,
        );
      if (state === "uncertain")
        return failure(
          "Status pengiriman belum dapat dipastikan. Hubungi senireligi@ub.ac.id sebelum mengirim ulang.",
          409,
        );
      // A timeout may occur after SMTP accepted the email. Never automatically resend this ID.
      let sent = false;
      try {
        sent = await mailer.send(parsed, id);
      } catch {
        /* keep an uncertain receipt */
      }
      await store.finish(id.toLowerCase(), fingerprint, sent);
      if (!sent)
        return failure(
          "Pengiriman belum dapat dikonfirmasi. Hubungi senireligi@ub.ac.id sebelum mengirim ulang.",
          502,
        );
      return Response.json({ ok: true });
    } catch {
      return failure("Layanan pengiriman sementara tidak tersedia. Silakan coba lagi nanti.", 503);
    }
  };
}
