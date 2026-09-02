import { defineField, defineType } from "sanity"

export const faqSchema = defineType({
  name: "faq",
  title: "Pertanyaan Umum",
  type: "document",
  orderings: [{ title: "Urutan Tampil", name: "urutanAsc", by: [{ field: "urutan", direction: "asc" }] }],
  fields: [
    defineField({ name: "pertanyaan", title: "Pertanyaan", type: "string", description: "Tulis seperti pertanyaan yang biasa diajukan calon anggota.", validation: (r) => r.required().min(5).max(180) }),
    defineField({ name: "jawaban", title: "Jawaban", type: "text", rows: 6, description: "Berikan jawaban yang langsung, lengkap, dan mudah dipahami.", validation: (r) => r.required().min(10).max(2000) }),
    defineField({ name: "urutan", title: "Urutan Tampil", type: "number", description: "Angka lebih kecil tampil lebih awal.", validation: (r) => r.required().integer().min(0) }),
  ],
})
