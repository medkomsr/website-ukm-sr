import { defineField, defineType } from "sanity";

export const kabinetSchema = defineType({
  name: "kabinet",
  title: "Kabinet",
  type: "document",
  description:
    "Ditampilkan di bagian Kenali Kabinet Kami dan halaman detail kepengurusan. Kosongkan untuk memakai nama dan logo Kabinet Arkhasena.",
  fields: [
    defineField({
      name: "nama",
      title: "Nama kabinet",
      type: "string",
      description: "Contoh: Kabinet Arkhasena",
    }),
    defineField({
      name: "logo",
      title: "Logo kabinet",
      type: "image",
      description: "Gunakan PNG berlatar transparan agar menyatu dengan latar hijau.",
    }),
  ],
  preview: {
    select: { title: "nama", media: "logo" },
    prepare: ({ title, media }) => ({ title: title || "Kabinet", media }),
  },
});
