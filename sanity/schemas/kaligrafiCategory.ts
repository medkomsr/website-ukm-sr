import { defineField, defineType } from "sanity"

export const kaligrafiCategorySchema = defineType({
  name: "kaligrafiCategory",
  title: "Kategori Kaligrafi",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama Kategori",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Urutan Tampil",
      type: "number",
      description: "Angka lebih kecil ditampilkan lebih awal.",
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Urutan Tampil",
      name: "displayOrderAsc",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
})
