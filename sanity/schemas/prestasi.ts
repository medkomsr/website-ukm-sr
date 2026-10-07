import { defineField, defineType } from "sanity";
import { srFields } from "@/lib/constants/art-fields";

export const prestasiSchema = defineType({
  name: "prestasi",
  title: "Prestasi",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Tahun",
      type: "number",
      validation: (r) => r.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: "title",
      title: "Prestasi / Kompetisi",
      type: "string",
      description: "Contoh: Musabaqah Tilawatil Qur'an Mahasiswa Nasional",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "level",
      title: "Tingkat",
      type: "string",
      options: {
        list: ["Kampus", "Kota", "Provinsi", "Nasional", "Internasional"],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "position",
      title: "Pencapaian",
      type: "string",
      description: "Contoh: Juara 1, Runner Up, Penampil Terbaik, UKM Terbaik",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      description: "Dipakai sebagai pilihan filter di arsip prestasi.",
      options: {
        list: ["Kompetisi", "Penghargaan", "Kolaborasi", "Rekam Jejak"],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "Kompetisi",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "field",
      title: "Bidang (opsional)",
      type: "string",
      description: "Bidang yang mewakili Seni Religi. Tampil sebagai label kecil di atas judul.",
      options: { list: srFields.map(({ name }) => name) },
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 5,
      description: "Cerita pencapaian. Tampil di popup detail dan kartu prestasi di beranda.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Foto kejuaraan",
      type: "image",
      options: { hotspot: true },
      description:
        "Dokumentasi pemenang, tim memegang piala, atau penyerahan penghargaan. Tampil di popup detail dan beranda.",
      fields: [{ name: "alt", title: "Deskripsi foto", type: "string" }],
    }),
    defineField({ name: "organizer", title: "Penyelenggara (opsional)", type: "string" }),
    defineField({ name: "location", title: "Lokasi (opsional)", type: "string" }),
    defineField({
      name: "participants",
      title: "Peserta / anggota tim",
      type: "array",
      description: "Nama tampil di arsip; foto dan fakultas tampil di popup detail.",
      of: [
        {
          type: "object",
          name: "achievementParticipant",
          fields: [
            defineField({
              name: "name",
              title: "Nama lengkap",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "faculty", title: "Fakultas / program studi", type: "string" }),
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: "name", subtitle: "faculty", media: "image" } },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Tahun terbaru",
      name: "yearDesc",
      by: [
        { field: "year", direction: "desc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", year: "year", level: "level", position: "position", media: "image" },
    prepare: ({ title, year, level, position, media }) => ({
      title,
      media,
      subtitle: [year, level, position].filter(Boolean).join(" · "),
    }),
  },
});
