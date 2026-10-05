import { defineField } from "sanity";

export const activityGalleryField = defineField({
  name: "gallery",
  title: "Galeri Dokumentasi",
  description:
    "Foto tambahan untuk tampilan bento dan galeri horizontal pada halaman detail. Gambar utama tetap menjadi foto pembuka.",
  type: "array",
  of: [
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Deskripsi gambar", type: "string" }),
        defineField({ name: "caption", title: "Keterangan foto", type: "string" }),
      ],
    },
  ],
});
