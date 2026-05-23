import { defineField, defineType } from "sanity"

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Pengaturan Situs",
  type: "document",
  fields: [
    defineField({ name: "namaOrg", title: "Nama Organisasi", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline / Deskripsi Footer", type: "text", rows: 2 }),
    defineField({ name: "tahunBerdiri", title: "Tahun Berdiri", type: "number" }),
    defineField({ name: "jumlahAnggota", title: "Jumlah Anggota (contoh: 150+)", type: "string" }),
    defineField({ name: "jumlahPenghargaan", title: "Jumlah Penghargaan (contoh: 25+)", type: "string" }),
    defineField({ name: "jumlahKegiatan", title: "Jumlah Kegiatan/Tahun (contoh: 50+)", type: "string" }),
    defineField({ name: "alamat", title: "Alamat", type: "text", rows: 2 }),
    defineField({ name: "telepon", title: "Nomor Telepon / WhatsApp", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "instagram", title: "Instagram Handle (contoh: @senireligi_ub)", type: "string" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "youtube", title: "YouTube Channel", type: "string" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url" }),
    defineField({ name: "facebook", title: "Facebook Page", type: "string" }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
  ],
})
