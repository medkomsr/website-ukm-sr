import { CONTACT_EMAIL_PATTERN, CONTACT_LIMITS, CONTACT_SUBJECTS } from "./contact-config";

export const CONTACT_FIELDS = ["subject", "name", "email", "organization", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactErrors = Partial<Record<ContactField, string>>;
const controls = /[\u0000-\u001f\u007f]/;

export function validateContact(form: FormData) {
  const values = Object.fromEntries(
    CONTACT_FIELDS.map((key) => {
      const raw = form.get(key);
      return [key, typeof raw === "string" ? raw.trim() : ""];
    }),
  ) as Record<ContactField, string>;
  const errors: ContactErrors = {};
  if (!CONTACT_SUBJECTS.some((item) => item.name === values.subject))
    errors.subject = "Pilih keperluan terlebih dahulu.";
  if (!values.name || values.name.length > CONTACT_LIMITS.name || controls.test(values.name))
    errors.name = "Isi nama yang valid, maksimal 100 karakter.";
  if (
    !CONTACT_EMAIL_PATTERN.test(values.email) ||
    values.email.length > CONTACT_LIMITS.email ||
    controls.test(values.email)
  )
    errors.email = "Masukkan alamat email lengkap, misalnya nama@domain.com.";
  if (
    values.organization.length > CONTACT_LIMITS.organization ||
    controls.test(values.organization)
  )
    errors.organization = "Instansi maksimal 160 karakter tanpa baris baru.";
  if (
    !values.message ||
    values.message.length > CONTACT_LIMITS.message ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(values.message)
  )
    errors.message = "Isi pesan Anda, maksimal 4.000 karakter.";
  for (const key of CONTACT_FIELDS) {
    if (form.getAll(key).length > 1) errors[key] = "Isian ganda tidak diizinkan.";
  }
  return { values, errors, valid: Object.keys(errors).length === 0 };
}
