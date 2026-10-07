import { defineField, defineType } from "sanity";

const memberFields = [
  defineField({ name: "image", title: "Foto", type: "image", options: { hotspot: true } }),
  defineField({ name: "name", title: "Nama", type: "string" }),
  defineField({ name: "role", title: "Jabatan", type: "string" }),
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Alamat halaman /tentang/bidang/<slug>. Agar tersambung ke kartu, gunakan: fahmil-quran, syarhil-quran, hifdzil-quran, ttq, ktdaq, banjari-nasyid, khattil-quran, atau dia.",
      options: { source: "abbr" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fullName",
      title: "Nama lengkap (opsional)",
      type: "string",
      description: "Contoh: Tilawah & Tartil Qur'an",
    }),
    defineField({
      name: "description",
      title: "Deskripsi bidang (opsional)",
      type: "text",
      rows: 5,
      description: "Kosongkan untuk memakai deskripsi bawaan.",
    }),
    defineField({
      name: "image",
      title: "Foto pengurus",
      type: "image",
      description: "Foto kartu di Tentang Kami sekaligus foto kebersamaan di halaman detail.",
      options: { hotspot: true },
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
      description: "Dokumentasi pembinaan, kejuaraan, dan kegiatan bidang.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", title: "Keterangan", type: "string" }),
            defineField({
              name: "alt",
              title: "Deskripsi gambar (aksesibilitas)",
              type: "string",
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
