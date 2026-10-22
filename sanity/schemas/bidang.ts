import { requiredText, optionalText, validSlug, validImage } from "../validation";
import { fixedProfileSlug } from "@/sanity/presets";
import { defineField, defineType } from "sanity";
import { validateFieldDescription } from "../../lib/content/field-description";

const memberFields = [
  defineField({
    name: "image",
    title: "Foto",
    type: "image",
    options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
    validation: (r) => r.custom(validImage),
  }),
  defineField({
    name: "name",
    title: "Nama",
    type: "string",
    validation: (r) => requiredText(r, 100),
  }),
  defineField({
    name: "role",
    title: "Jabatan",
    type: "string",
    validation: (r) => requiredText(r, 100),
  }),
];

export const bidangSchema = defineType({
  name: "bidang",
  title: "Pengurus Bidang",
  type: "document",
  fields: [
    defineField({
      name: "abbr",
      title: "Nama bidang",
      type: "string",
      description: "Judul besar di halaman detail. Contoh: Fahmil, KTDAQ",
      validation: (r) => requiredText(r, 100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Alamat halaman /tentang/bidang/<slug>. Agar tersambung ke kartu, gunakan: fahmil-quran, syarhil-quran, hifdzil-quran, ttq, ktdaq, banjari-nasyid, khattil-quran, atau dia.",
      options: { source: "abbr", maxLength: 96 },
      readOnly: ({ document }) => !!fixedProfileSlug("bidang", document?._id),
      validation: (r) =>
        r
          .required()
          .custom(validSlug)
          .error()
          .custom((value, { document }) => {
            const expected = fixedProfileSlug("bidang", document?._id);
            return (
              !expected ||
              value?.current === expected ||
              `Slug profil bawaan harus ${expected} agar tetap terhubung ke kartu Tentang Kami.`
            );
          }),
    }),
    defineField({
      name: "fullName",
      title: "Nama lengkap (opsional)",
      type: "string",
      description: "Contoh: Tilawah & Tartil Qur'an",
      validation: (r) => optionalText(r, 100),
    }),
    defineField({
      name: "description",
      title: "Deskripsi bidang",
      type: "text",
      rows: 5,
      description:
        "Wajib diisi. Maksimal 50 kata dan 350 karakter termasuk spasi, dalam satu paragraf tanpa Enter. Isi bagian Deskripsi Bidang; teks pembuka tetap memakai kalimat bawaan.",
      validation: (rule) => rule.required().custom(validateFieldDescription),
    }),
    defineField({
      name: "image",
      title: "Thumbnail kartu",
      type: "image",
      description:
        "Foto untuk kartu di Tentang Kami. Tidak ditampilkan sebagai gambar besar di detail.",
      options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
      validation: (r) => r.custom(validImage),
    }),
    defineField({
      name: "ketuaBidang",
      title: "Ketua bidang",
      type: "object",
      fields: memberFields,
    }),
    defineField({
      name: "wakilKetuaBidang",
      title: "Wakil ketua bidang",
      type: "object",
      fields: memberFields,
    }),
    defineField({
      name: "gallery",
      title: "Galeri dokumentasi",
      description: "Maksimal 10 foto dokumentasi pembinaan, kejuaraan, dan kegiatan bidang.",
      type: "array",
      validation: (r) => r.max(10),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
              validation: (r) => r.required().custom(validImage),
            }),
            defineField({
              name: "caption",
              title: "Keterangan",
              type: "string",
              validation: (r) => optionalText(r, 200),
            }),
            defineField({
              name: "alt",
              title: "Deskripsi gambar (aksesibilitas)",
              type: "string",
              validation: (r) => optionalText(r, 200),
            }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "abbr", subtitle: "fullName", media: "image" },
  },
});
