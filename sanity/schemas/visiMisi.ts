import { defineField, defineType } from "sanity"

export const visiMisiSchema = defineType({
  name: "visiMisi",
  title: "Visi & Misi",
  type: "document",
  fields: [
    defineField({ name: "visi", title: "Visi", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "misi",
      title: "Misi",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required().min(1),
    }),
  ],
})
