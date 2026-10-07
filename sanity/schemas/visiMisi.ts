import { defineField, defineType } from "sanity";

export const visiMisiSchema = defineType({
  name: "visiMisi",
  title: "Visi & Misi",
  type: "document",
  fields: [
    defineField({
      name: "visi",
      title: "Visi",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "misi",
      title: "Misi",
      description:
        "Satu butir per misi. Nomor 01, 02, 03 dibuat otomatis sesuai urutan; seret untuk mengubah urutan.",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Visi & Misi" }) },
});
