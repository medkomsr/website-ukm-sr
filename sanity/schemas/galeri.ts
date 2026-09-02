import { defineField, defineType } from "sanity"

export const galeriSchema = defineType({
  name: "galeri",
  title: "Galeri",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Foto", type: "image", description: "Unggah foto yang tajam dan relevan dengan kegiatan.", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Keterangan Foto", type: "string", description: "Jelaskan momen secara singkat.", validation: (r) => r.required().min(2).max(160) }),
    defineField({ name: "alt", title: "Deskripsi gambar (untuk aksesibilitas)", type: "string", description: "Jelaskan isi foto bagi pengunjung yang tidak dapat melihat gambar.", validation: (r) => r.required().min(5).max(160) }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      description: "Pilih kategori yang paling sesuai agar foto mudah dikelompokkan.",
      options: { list: ["Kegiatan", "Penghargaan", "Workshop", "Festival", "Lainnya"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Urutan Tampil", type: "number", description: "Angka lebih kecil tampil lebih awal.", validation: (r) => r.required().integer().min(0) }),
  ],
  preview: {
    select: { title: "caption", media: "image", subtitle: "category" },
  },
})
