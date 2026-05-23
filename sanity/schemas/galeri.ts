import { defineField, defineType } from "sanity"

export const galeriSchema = defineType({
  name: "galeri",
  title: "Galeri",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Foto", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Keterangan", type: "string", validation: (r) => r.required() }),
    defineField({ name: "alt", title: "Alt Text", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: { list: ["Kegiatan", "Penghargaan", "Workshop", "Festival", "Lainnya"] },
    }),
    defineField({ name: "order", title: "Urutan", type: "number" }),
  ],
  preview: {
    select: { title: "caption", media: "image", subtitle: "category" },
  },
})
