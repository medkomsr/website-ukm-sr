import {
  CONTACT_LIMITS,
  CONTACT_SUBJECTS,
  CONTACT_EMAIL_PATTERN as emailPattern,
  CONTACT_FILE_EXTENSION as extension,
} from "../lib/contact-config";
import type { ContactMessage } from "./contact-mailer";
import { failure } from "./response";
const maxBody = CONTACT_LIMITS.bodyBytes,
  maxAttachmentBytes = CONTACT_LIMITS.attachmentBytes;
const subjects = new Set<string>(CONTACT_SUBJECTS.map((item) => item.name));
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

  const field = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = field("name");
  const email = field("email");
  const organization = field("organization");
  const subject = field("subject");
  const message = field("message");
  if (field("website")) return failure("Permintaan tidak valid.");
  if (
    !name ||
    name.length > CONTACT_LIMITS.name ||
    !emailPattern.test(email) ||
    email.length > CONTACT_LIMITS.email ||
    organization.length > CONTACT_LIMITS.organization ||
    !subjects.has(subject) ||
    !message ||
    message.length > CONTACT_LIMITS.message ||
    /[\r\n]/.test(name + email + organization)
  ) {
    return failure("Periksa nama, email, keperluan, dan isi pesan Anda.");
  }
  const files = form.getAll("attachments");
  if (
    files.length > CONTACT_LIMITS.files ||
    files.some(
      (file) =>
        typeof file === "string" ||
        !extension.test(file.name) ||
        file.name.length > 180 ||
        /[\r\n]/.test(file.name),
    )
  ) {
    return failure("Pilih maksimal 5 lampiran berupa PDF, dokumen, atau gambar.");
  }
  const uploads = files as File[];
  if (uploads.reduce((sum, file) => sum + file.size, 0) > maxAttachmentBytes)
    return failure("Ukuran total lampiran maksimal 3 MB.", 413);
  const attachments = await Promise.all(
    uploads.map(async (file) => ({
      filename: file.name.replace(/[\\/]/g, "_"),
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );
  const text = `Keperluan: ${subject}\nNama: ${name}\nEmail: ${email}\nInstansi / komunitas: ${organization || "—"}\n\n${message}`;
  return { name, email, subject, text, attachments };
}
