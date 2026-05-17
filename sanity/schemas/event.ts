import { defineField, defineType } from "sanity"

export const eventSchema = defineType({
  name: "event",
  title: "Kegiatan",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Judul", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Deskripsi Singkat", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "longDescription", title: "Deskripsi Lengkap", type: "text", rows: 6 }),
    defineField({ name: "image", title: "Gambar", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "category", title: "Kategori", type: "string", options: { list: ["Festival", "Workshop", "Lomba", "Rutin", "Pengumuman"] }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Tanggal", type: "string", validation: (r) => r.required() }),
    defineField({ name: "time", title: "Waktu", type: "string" }),
    defineField({ name: "location", title: "Lokasi", type: "string" }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: ["upcoming", "ongoing", "completed"] }, validation: (r) => r.required() }),
    defineField({ name: "organizer", title: "Penyelenggara", type: "string" }),
    defineField({ name: "maxParticipants", title: "Kapasitas Peserta", type: "number" }),
    defineField({
      name: "agenda",
      title: "Agenda / Rundown",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "time", title: "Waktu", type: "string" }),
            defineField({ name: "item", title: "Acara", type: "string" }),
          ],
          preview: { select: { title: "time", subtitle: "item" } },
        },
      ],
    }),
    defineField({ name: "tags", title: "Tag", type: "array", of: [{ type: "string" }] }),
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "status" },
  },
})
