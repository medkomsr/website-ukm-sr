import { defineField, defineType } from "sanity"

export const homePageSchema = defineType({
  name: "homePage",
  title: "Halaman Beranda",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "judul1", title: "Judul Baris 1 (sebelum highlight)", type: "string", description: "Contoh: Seni yang " }),
        defineField({ name: "judulHighlight", title: "Kata Highlight (warna emas)", type: "string", description: "Contoh: Menginspirasi" }),
        defineField({ name: "judul2", title: "Judul Baris 2", type: "string", description: "Contoh: Iman yang Menguatkan" }),
        defineField({ name: "deskripsi", title: "Deskripsi", type: "text", rows: 2 }),
        defineField({ name: "ctaText", title: "Teks Tombol CTA", type: "string" }),
      ],
    }),
    defineField({
      name: "about",
      title: "About Section",
      type: "object",
      fields: [
        defineField({ name: "judul1", title: "Judul (sebelum highlight)", type: "string", description: "Contoh: Berkarya dengan tulus, " }),
        defineField({ name: "judulHighlight", title: "Kata Highlight", type: "string", description: "Contoh: Inovasi tanpa batas" }),
        defineField({ name: "deskripsi1", title: "Paragraf 1", type: "text", rows: 3 }),
        defineField({ name: "deskripsi2", title: "Paragraf 2", type: "text", rows: 3 }),
        defineField({
          name: "highlights",
          title: "Poin Keunggulan",
          type: "array",
          of: [{ type: "string" }],
          description: "Contoh: 150+ Anggota dari Seluruh Fakultas",
        }),
      ],
    }),
    defineField({
      name: "divisions",
      title: "Divisi Section",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Judul Section", type: "string" }),
        defineField({ name: "subheading", title: "Subjudul Section", type: "text", rows: 2 }),
      ],
    }),
  ],
})
