import { defineField, defineType } from "sanity"

export const prestasiSchema = defineType({
  name: "prestasi",
  title: "Prestasi",
  type: "document",
  groups: [
    { name: "main", title: "Informasi Utama", default: true },
    { name: "display", title: "Pengaturan Tampilan" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Judul Prestasi",
      type: "string",
      group: "main",
      description: "Contoh: Juara 1 Festival Hadrah Nasional 2026.",
      validation: (r) => r.required().min(2).max(120),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
      group: "main",
      description: "Jelaskan pencapaian, peserta, dan konteksnya secara ringkas.",
      validation: (r) => r.required().min(20).max(2000),
    }),
    defineField({
      name: "year",
      title: "Tahun",
      type: "number",
      group: "main",
      description: "Gunakan empat digit, misalnya 2026.",
      validation: (r) => r.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      group: "main",
      description: "Pilih jenis pencapaian yang paling sesuai.",
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
      group: "main",
      description: "Pilih cakupan penyelenggaraan prestasi.",
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
      group: "main",
      description: "Contoh: Juara 1, Runner Up, Penampil Terbaik, UKM Terbaik",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "organizer",
      title: "Penyelenggara",
      type: "string",
      group: "main",
      description: "Tulis nama lembaga yang menyelenggarakan kegiatan.",
      validation: (r) => r.required().min(2).max(160),
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      group: "main",
      description: "Contoh: Malang atau Universitas Brawijaya.",
      validation: (r) => r.required().min(2).max(160),
    }),
    defineField({
      name: "featured",
      title: "Tampilkan di Unggulan",
      type: "boolean",
      group: "display",
      initialValue: false,
      description: "Jika diaktifkan, prestasi ini akan ditampilkan di bagian unggulan halaman prestasi",
    }),
    defineField({
      name: "article",
      title: "Artikel Terkait",
      type: "reference",
      group: "main",
      to: [{ type: "artikel" }, { type: "event" }],
      description: "Opsional. Hubungkan dengan Artikel atau Kegiatan yang terkait.",
    }),
    defineField({
      name: "order",
      title: "Urutan",
      type: "number",
      group: "display",
      description: "Angka lebih kecil ditampilkan lebih awal",
      validation: (r) => r.integer().min(0),
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
