import { requiredText, optionalText, validSlug, validImage } from "../validation";
import { defineField, defineType } from "sanity";
import { activityGalleryField } from "@/sanity/schemas/activity-gallery";

const isEvent = (document?: Record<string, unknown>) => document?.jenis === "acara";

export const beritaAcaraSchema = defineType({
  name: "beritaAcara",
  title: "Berita & Acara",
  type: "document",
  fields: [
    defineField({
      name: "jenis",
      title: "Jenis",
      type: "string",
      description: "Acara menampilkan status, waktu, lokasi, dan rundown.",
      options: {
        list: [
          { title: "Berita", value: "berita" },
          { title: "Acara", value: "acara" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "berita",
      validation: (r) => requiredText(r, 120),
    }),
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (r) => requiredText(r, 120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Alamat halaman detail. Tekan Generate untuk membuat dari judul.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required().custom(validSlug).error(),
    }),
    defineField({
      name: "date",
      title: "Tanggal",
      type: "date",
      description:
        "Tanggal terbit berita atau tanggal pelaksanaan acara. Menentukan urutan terbaru.",
      options: { dateFormat: "D MMMM YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          "Berita",
          "Liputan",
          "Prestasi",
          "Pengumuman",
          "Festival",
          "Workshop",
          "Lomba",
          "Rutin",
        ],
      },
      validation: (r) => requiredText(r, 120),
    }),
    defineField({
      name: "image",
      title: "Foto utama",
      type: "image",
      description:
        "Tampil di kartu beranda, pratinjau, sampul halaman detail, dan sebagai foto pertama Dokumentasi.",
      options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
      validation: (r) => r.required().custom(validImage),
    }),
    defineField({
      name: "description",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      description:
        "Maksimal 350 karakter. Tampil pada kartu, pratinjau, dan pembuka halaman detail.",
      validation: (r) => requiredText(r, 350),
    }),
    defineField({
      name: "body",
      title: "Isi berita",
      type: "array",
      description: "Isi cerita lengkap (teks kecil) di bawah paragraf pembuka.",
      of: [{ type: "block" }],
      validation: (r) => r.max(200),
    }),
    activityGalleryField,
    defineField({
      name: "status",
      title: "Status acara",
      type: "string",
      options: {
        list: [
          { title: "Akan Datang", value: "upcoming" },
          { title: "Berlangsung", value: "ongoing" },
          { title: "Selesai", value: "completed" },
        ],
        layout: "radio",
      },
      hidden: ({ document }) => !isEvent(document),
      validation: (r) =>
        r.custom((value, { document }) =>
          isEvent(document) && !value ? "Status wajib diisi untuk acara." : true,
        ),
    }),
    defineField({
      name: "time",
      title: "Waktu",
      type: "string",
      description: "Contoh: 19.00 – 21.00 WIB",
      validation: (r) => optionalText(r, 50),
      hidden: ({ document }) => !isEvent(document),
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      validation: (r) => optionalText(r, 200),
      hidden: ({ document }) => !isEvent(document),
    }),
    defineField({
      name: "agenda",
      title: "Rundown",
      type: "array",
      validation: (r) => r.max(30),
      hidden: ({ document }) => !isEvent(document),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "time",
              title: "Waktu",
              type: "string",
              validation: (r) => requiredText(r, 50),
            }),
            defineField({
              name: "item",
              title: "Acara",
              type: "string",
              validation: (r) => requiredText(r, 120),
            }),
          ],
          preview: { select: { title: "time", subtitle: "item" } },
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tag",
      type: "array",
      validation: (r) => r.max(10).unique(),
      of: [{ type: "string", validation: (r) => requiredText(r, 40) }],
    }),
  ],
  orderings: [
    { title: "Tanggal terbaru", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", media: "image", jenis: "jenis", date: "date" },
    prepare: ({ title, media, jenis, date }) => ({
      title,
      media,
      subtitle: [jenis === "acara" ? "Acara" : "Berita", date].filter(Boolean).join(" · "),
    }),
  },
});
