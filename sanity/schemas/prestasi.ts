import { defineField, defineType } from "sanity"

export const prestasiSchema = defineType({
  name: "prestasi",
  title: "Prestasi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul Prestasi",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Tahun",
      type: "number",
      validation: (r) => r.required().min(2000).max(2100),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Kompetisi", value: "Kompetisi" },
          { title: "Penghargaan", value: "Penghargaan" },
          { title: "Kolaborasi", value: "Kolaborasi" },
          { title: "Rekam Jejak", value: "Rekam Jejak" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "level",
      title: "Tingkat",
      type: "string",
      options: {
        list: [
          { title: "Kampus", value: "Kampus" },
          { title: "Kota", value: "Kota" },
          { title: "Provinsi", value: "Provinsi" },
          { title: "Nasional", value: "Nasional" },
          { title: "Internasional", value: "Internasional" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "position",
      title: "Posisi / Gelar",
      type: "string",
      description: "Contoh: Juara 1, Runner Up, Penampil Terbaik, UKM Terbaik",
    }),
    defineField({
      name: "organizer",
      title: "Penyelenggara",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Tampilkan di Unggulan",
      type: "boolean",
      initialValue: false,
      description: "Jika diaktifkan, prestasi ini akan ditampilkan di bagian unggulan halaman prestasi",
    }),
    defineField({
      name: "article",
      title: "Artikel Terkait",
      type: "reference",
      to: [{ type: "artikel" }, { type: "event" }],
      description: "Hubungkan dengan artikel atau event yang terkait (opsional)",
    }),
    defineField({
      name: "order",
      title: "Urutan",
      type: "number",
      description: "Angka lebih kecil ditampilkan lebih awal",
    }),
  ],
  orderings: [
    {
      title: "Tahun Terbaru",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Tahun Terlama",
      name: "yearAsc",
      by: [{ field: "year", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      description: "level",
    },
    prepare({ title, subtitle, description }) {
      return {
        title,
        subtitle: `${subtitle} · ${description}`,
      }
    },
  },
})
