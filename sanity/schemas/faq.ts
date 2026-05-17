import { defineField, defineType } from "sanity"

export const faqSchema = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  orderings: [{ title: "Urutan Tampil", name: "urutanAsc", by: [{ field: "urutan", direction: "asc" }] }],
  fields: [
    defineField({ name: "pertanyaan", title: "Pertanyaan", type: "string", validation: (r) => r.required() }),
    defineField({ name: "jawaban", title: "Jawaban", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "urutan", title: "Urutan Tampil", type: "number", description: "Angka kecil tampil lebih awal" }),
  ],
})
