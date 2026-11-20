export const FIELD_DESCRIPTION_MAX_WORDS = 50;
export const FIELD_DESCRIPTION_MAX_CHARACTERS = 350;

export function validateFieldDescription(value: unknown): true | string {
  if (typeof value !== "string" || !value.trim()) return "Deskripsi bidang wajib diisi.";
  if (value.length > FIELD_DESCRIPTION_MAX_CHARACTERS) {
    return `Maksimal ${FIELD_DESCRIPTION_MAX_CHARACTERS} karakter, termasuk spasi (saat ini ${value.length}).`;
  }
  const words = value.trim().split(/\s+/u).length;
  if (words > FIELD_DESCRIPTION_MAX_WORDS) {
    return `Maksimal ${FIELD_DESCRIPTION_MAX_WORDS} kata (saat ini ${words}). Ringkas deskripsi sebelum menerbitkan.`;
  }
  if (/[\r\n\u2028\u2029]/u.test(value)) {
    return "Gunakan satu paragraf tanpa baris baru agar tata letak tetap rapi.";
  }
  return true;
}
