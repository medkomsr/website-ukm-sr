import { defineField } from "sanity";

export const activityGalleryField = defineField({
  name: "gallery",
  title: "Galeri Dokumentasi",
  description:
    "Foto tambahan untuk galeri Dokumentasi pada halaman detail. Foto utama otomatis menjadi foto pertama, jadi tidak perlu diunggah ulang di sini.",
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
