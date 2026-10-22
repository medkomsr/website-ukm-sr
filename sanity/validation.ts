import type { StringRule, TextRule, ValidationContext } from "sanity";

export const textValue =
  (max: number, required = false) =>
  (value: unknown) => {
    if (value === undefined || value === null) return required ? "Wajib diisi." : true;
    if (typeof value !== "string" || !value.trim()) return "Tidak boleh kosong atau hanya spasi.";
    if (value.length > max) return `Maksimal ${max} karakter termasuk spasi.`;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value))
      return "Teks mengandung karakter kontrol yang tidak didukung.";
    return true;
  };

export function requiredText<T extends StringRule | TextRule>(rule: T, max: number) {
  return rule.required().max(max).custom(textValue(max, true)) as T;
}
export function optionalText<T extends StringRule | TextRule>(rule: T, max: number) {
  return rule.max(max).custom(textValue(max)) as T;
}

export function validSlug(value: unknown) {
  const slug = (value as { current?: unknown } | undefined)?.current;
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 96
    ? true
    : "Gunakan huruf kecil, angka, dan tanda hubung; maksimal 96 karakter.";
}

type ImageValue = { asset?: { _ref?: string } };
type ImageMetadata = {
  size?: number;
  mimeType?: string;
  metadata?: { dimensions?: { width?: number; height?: number } };
};
export function checkImageMetadata(asset: ImageMetadata | null) {
  if (!asset) return "Aset gambar tidak ditemukan. Pilih atau unggah gambar yang valid.";
  if (typeof asset.size !== "number" || asset.size <= 0 || asset.size > 5 * 1024 * 1024)
    return "Ukuran gambar maksimal 5 MB. Kompres gambar sebelum mengunggah.";
  if (
    !asset.mimeType ||
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(asset.mimeType)
  )
    return "Gunakan gambar JPG, PNG, WebP, atau AVIF.";
  const { width = 0, height = 0 } = asset.metadata?.dimensions ?? {};
  if (width < 128 || height < 128) return "Lebar dan tinggi gambar minimal 128 piksel.";
  if (width > 12000 || height > 12000) return "Lebar dan tinggi gambar maksimal 12.000 piksel.";
  return true;
}

/** Publish validation; uploading an asset itself is still handled by Sanity. */
export async function validImage(value: ImageValue | undefined, context: ValidationContext) {
  if (!value) return true;
  if (!value.asset?._ref) return "Pilih atau unggah gambar sebelum menerbitkan.";
  try {
    const asset = await context
      .getClient({ apiVersion: "2024-01-01" })
      .withConfig({ useCdn: false })
      .fetch<ImageMetadata | null>(
        `*[_id == $id && _type == "sanity.imageAsset"][0]{size,mimeType,metadata{dimensions}}`,
        { id: value.asset._ref },
      );
    return checkImageMetadata(asset);
  } catch {
    return "Gambar belum dapat diverifikasi. Periksa koneksi lalu coba kembali.";
  }
}
