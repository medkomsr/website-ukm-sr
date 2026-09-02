import { defineField, defineType } from "sanity"

export const visiMisiSchema = defineType({
  name: "visiMisi",
  title: "Visi & Misi",
  type: "document",
  fields: [
    defineField({ name: "visi", title: "Visi", type: "text", rows: 5, description: "Tuliskan pernyataan visi organisasi secara ringkas.", validation: (r) => r.required().min(20).max(1000) }),
    defineField({
      name: "misi",
      title: "Misi",
      type: "array",
      description: "Tambahkan satu poin untuk setiap misi.",
      of: [{ type: "string", validation: (r) => r.required().min(10).max(500) }],
      validation: (r) => r.required().min(1).max(12),
    }),
  ],
})
