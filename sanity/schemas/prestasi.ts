import { requiredText, optionalText, validImage } from "../validation";
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
      validation: (r) => requiredText(r, 120),
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
      validation: (r) => requiredText(r, 120),
    }),
    defineField({
      name: "position",
      title: "Pencapaian",
      type: "string",
      description: "Contoh: Juara 1, Runner Up, Penampil Terbaik, UKM Terbaik",
      validation: (r) => requiredText(r, 120),
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
      validation: (r) => requiredText(r, 120),
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
      description: "Maksimal 350 karakter. Tampil di popup detail dan kartu prestasi di beranda.",
      validation: (r) => requiredText(r, 350),
    }),
    defineField({
      name: "image",
      title: "Foto kejuaraan",
      type: "image",
      options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
      validation: (r) => r.custom(validImage),
      description:
        "Dokumentasi pemenang, tim memegang piala, atau penyerahan penghargaan. Tampil di popup detail dan beranda.",
      fields: [
        {
          name: "alt",
          title: "Deskripsi foto",
          type: "string",
          validation: (r) => optionalText(r, 200),
        },
      ],
    }),
    defineField({
      name: "organizer",
      title: "Penyelenggara (opsional)",
      type: "string",
      validation: (r) => optionalText(r, 200),
    }),
    defineField({
      name: "location",
      title: "Lokasi (opsional)",
      type: "string",
      validation: (r) => optionalText(r, 200),
    }),
    defineField({
      name: "participants",
      title: "Peserta / anggota tim",
      type: "array",
      validation: (r) => r.max(50),
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
              validation: (r) => requiredText(r, 100),
            }),
            defineField({
              name: "faculty",
              title: "Fakultas / program studi",
              type: "string",
              validation: (r) => optionalText(r, 200),
            }),
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
              validation: (r) => r.custom(validImage),
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
