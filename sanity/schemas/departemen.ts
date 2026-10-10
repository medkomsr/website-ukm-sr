import { fixedProfileSlug } from "@/sanity/presets";
import { defineField, defineType } from "sanity";

export const departemenSchema = defineType({
  name: "departemen",
  title: "Kepengurusan Inti",
  type: "document",
  fields: [
    defineField({
      name: "abbr",
      title: "Nama singkat",
      type: "string",
      description:
        "Judul besar di halaman detail. Kartu di Tentang Kami memakai BKRT, Minba, PSDM, dan Medkom.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Alamat halaman /tentang/<slug>. Agar tersambung ke kartu, gunakan bkrt, minba, psdm, atau medkom.",
      options: { source: "abbr" },
      readOnly: ({ document }) => !!fixedProfileSlug("departemen", document?._id),
      validation: (r) =>
        r.required().custom((value, { document }) => {
          const expected = fixedProfileSlug("departemen", document?._id);
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
      description: "Tampil di bawah judul halaman detail.",
    }),
    defineField({
      name: "image",
      title: "Thumbnail kartu",
      type: "image",
      description:
        "Foto untuk kartu di Tentang Kami. Tidak ditampilkan sebagai gambar besar di detail.",
      options: { hotspot: true },
    }),
    defineField({
      name: "programKerja",
      title: "Program kerja",
      type: "array",
      of: [
        {
          type: "object",
          name: "programKerja",
          fields: [
            defineField({ name: "foto", title: "Foto", type: "image", options: { hotspot: true } }),
            defineField({
              name: "nama",
              title: "Nama program kerja",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "detail", title: "Detail program kerja", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "nama", subtitle: "detail", media: "foto" } },
        },
      ],
    }),
    defineField({
      name: "pengurus",
      title: "Pengurus",
      description: "Urutan tampil mengikuti urutan di sini.",
      type: "array",
      of: [
        {
          type: "object",
          name: "pengurus",
          fields: [
            defineField({ name: "foto", title: "Foto", type: "image", options: { hotspot: true } }),
            defineField({
              name: "nama",
              title: "Nama",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "jabatan", title: "Jabatan", type: "string" }),
          ],
          preview: { select: { title: "nama", subtitle: "jabatan", media: "foto" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "abbr", subtitle: "fullName", media: "image" },
  },
});
