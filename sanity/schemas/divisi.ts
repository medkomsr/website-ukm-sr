import { defineField, defineType } from "sanity"

export const divisiSchema = defineType({
  name: "divisi",
  title: "Divisi Seni",
  type: "document",
  orderings: [{ title: "Urutan Tampil", name: "urutanAsc", by: [{ field: "urutan", direction: "asc" }] }],
  fields: [
    defineField({ name: "nama", title: "Nama Divisi", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string", description: "Contoh: Seni Tulis Arab" }),
    defineField({ name: "deskripsi", title: "Deskripsi Singkat", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "jumlahAnggota", title: "Jumlah Anggota", type: "number" }),
    defineField({
      name: "ikon",
      title: "Ikon",
      type: "string",
      options: {
        list: [
          { title: "Pena (Kaligrafi)", value: "Pen" },
          { title: "Musik (Nasyid)", value: "Music" },
          { title: "Buku (Tilawah)", value: "BookOpen" },
          { title: "Teks (Puisi)", value: "FileText" },
          { title: "Orang (Humas)", value: "Users2" },
          { title: "Bintang", value: "Star" },
          { title: "Hati", value: "Heart" },
          { title: "Mikrofon", value: "Mic" },
        ],
      },
    }),
    defineField({ name: "accent", title: "Warna Aksen (hex)", type: "string", description: "Contoh: #059669" }),
    defineField({ name: "gambar", title: "Gambar Latar", type: "image", options: { hotspot: true } }),
    defineField({ name: "urutan", title: "Urutan Tampil", type: "number", description: "Angka kecil tampil lebih awal" }),
  ],
})
