import { CONTACT_LIMITS } from "../lib/contact-config";
import { validateContact } from "../lib/validate-contact";
import type { ContactMessage } from "./contact-mailer";
import { failure } from "./response";
const maxBody = CONTACT_LIMITS.bodyBytes;
export async function parseContact(
  request: Request,
  contentType: string,
): Promise<ContactMessage | Response> {
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
      if (size > maxBody) {
        await reader.cancel();
        return failure("Ukuran pesan terlalu besar.", 413);
      }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return failure("Pesan tidak dapat dibaca. Silakan coba lagi.");
  }

  if (
    form.has("attachments") ||
    Array.from(form.values()).some((value) => typeof value !== "string")
  )
    return failure("Lampiran tidak didukung. Kirim pesan berupa teks saja.");
  if (form.getAll("website").some((value) => typeof value !== "string" || value.trim()))
    return failure("Permintaan tidak valid.");
  const { values, errors, valid } = validateContact(form);
  if (!valid)
    return Response.json({ ok: false, error: "Periksa isian Anda.", errors }, { status: 400 });
  const { name, email, organization, subject, message } = values;
  const text = `Keperluan: ${subject}\nNama: ${name}\nEmail: ${email}\nInstansi / komunitas: ${organization || "—"}\n\n${message}`;
  return { name, email, subject, text };
}
