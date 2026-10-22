import { optionalText, validImage } from "../validation";
import { defineField } from "sanity";

export const activityGalleryField = defineField({
  name: "gallery",
  title: "Galeri Dokumentasi",
  description:
    "Foto tambahan untuk galeri Dokumentasi pada halaman detail. Foto utama otomatis menjadi foto pertama, jadi tidak perlu diunggah ulang di sini.",
  type: "array",
  validation: (r) => r.max(9),
  of: [
    {
      type: "image",
      options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
      validation: (r) => r.custom(validImage),
      fields: [
        defineField({
          name: "alt",
          title: "Deskripsi gambar",
          type: "string",
          validation: (r) => optionalText(r, 200),
        }),
        defineField({
          name: "caption",
          title: "Keterangan foto",
          type: "string",
          validation: (r) => optionalText(r, 200),
        }),
      ],
    },
  ],
});
