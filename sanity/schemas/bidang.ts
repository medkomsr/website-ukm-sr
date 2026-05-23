import { defineField, defineType } from "sanity"

const memberFields = [
  defineField({ name: "name",     title: "Nama",     type: "string" }),
  defineField({ name: "role",     title: "Jabatan",  type: "string" }),
  defineField({ name: "fakultas", title: "Fakultas", type: "string" }),
  defineField({ name: "angkatan", title: "Angkatan", type: "string" }),
]

export const bidangSchema = defineType({
  name: "bidang",
  title: "Bidang",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "abbr" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      title: "Label (contoh: Bidang)",
      type: "string",
      initialValue: "Bidang",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "abbr",
      title: "Singkatan / Nama Pendek",
      type: "string",
      description: "Contoh: TTQ, DIA, KTDAQ",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fullName",
      title: "Nama Lengkap",
      type: "string",
      description: "Contoh: Tilawah & Tartil Qur'an",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Foto Utama (Hero)",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "overlay",
      title: "CSS Overlay Gradient",
      type: "string",
      description: "Gradient CSS untuk overlay kartu, contoh: linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.92) 100%)",
    }),
    defineField({
      name: "description",
      title: "Deskripsi Bidang",
      type: "text",
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galeri Foto",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "image",   title: "Foto",        type: "image", options: { hotspot: true } }),
            defineField({ name: "alt",     title: "Alt Text",    type: "string" }),
            defineField({ name: "caption", title: "Keterangan",  type: "string" }),
          ],
          preview: {
            select: { title: "caption", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "ketuaBidang",
      title: "Ketua Bidang",
      type: "object",
      fields: memberFields,
    }),
    defineField({
      name: "wakilKetuaBidang",
      title: "Wakil Ketua Bidang",
      type: "object",
      fields: memberFields,
    }),
    defineField({
      name: "order",
      title: "Urutan Tampil",
      type: "number",
      description: "Angka lebih kecil ditampilkan lebih awal",
    }),
  ],
  orderings: [
    {
      title: "Urutan Tampil",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "fullName", media: "image", subtitle: "abbr" },
  },
})
