import { defineField, defineType } from "sanity"

const memberFields = [
  defineField({ name: "name", title: "Nama", type: "string" }),
  defineField({ name: "role", title: "Jabatan", type: "string" }),
  defineField({ name: "fakultas", title: "Fakultas", type: "string" }),
  defineField({ name: "angkatan", title: "Angkatan", type: "string" }),
]

export const departemenSchema = defineType({
  name: "departemen",
  title: "Departemen / Badan",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Label (Badan / Departemen)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "abbr", title: "Singkatan", type: "string", validation: (r) => r.required() }),
    defineField({ name: "fullName", title: "Nama Lengkap", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "abbr" }, validation: (r) => r.required() }),
    defineField({ name: "image", title: "Foto Hero", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "overlay", title: "CSS Overlay Gradient", type: "string" }),
    defineField({ name: "description", title: "Deskripsi", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "programs", title: "Program Kerja", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "programDescriptions", title: "Deskripsi Program Kerja", type: "array", of: [{ type: "text" }] }),
    defineField({
      name: "kepala",
      title: "Kepala Departemen / Badan",
      type: "object",
      fields: memberFields,
    }),
    defineField({
      name: "divisi",
      title: "Divisi",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nama Divisi", type: "string" }),
            defineField({ name: "kepala", title: "Kepala Divisi", type: "object", fields: memberFields }),
            defineField({
              name: "staff",
              title: "Staff",
              type: "array",
              of: [{ type: "object", fields: memberFields }],
            }),
          ],
          preview: { select: { title: "name" } },
        },
      ],
    }),
    defineField({ name: "order", title: "Urutan Tampil", type: "number" }),
  ],
  preview: {
    select: { title: "fullName", media: "image", subtitle: "abbr" },
  },
})
