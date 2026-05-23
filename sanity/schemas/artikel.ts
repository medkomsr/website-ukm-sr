import { defineField, defineType } from "sanity"

export const artikelSchema = defineType({
  name: "artikel",
  title: "Artikel",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Judul", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Ringkasan", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "image", title: "Gambar", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: { list: ["Prestasi", "Liputan", "Pengumuman", "Berita"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Tanggal Terbit", type: "string", validation: (r) => r.required() }),
    defineField({ name: "readTime", title: "Estimasi Waktu Baca", type: "string" }),
    defineField({
      name: "author",
      title: "Penulis",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Nama", type: "string" }),
        defineField({ name: "role", title: "Jabatan", type: "string" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Isi Artikel",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "tags", title: "Tag", type: "array", of: [{ type: "string" }] }),
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "category" },
  },
})
