import { defineField, defineType } from "sanity";

export const faqSchema = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Daftar FAQ",
      description:
        "Maksimal 3. Nomor 01, 02, 03 dibuat otomatis sesuai urutan; seret untuk mengubah urutan. Jika dikosongkan, website menampilkan 3 FAQ bawaan.",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "pertanyaan",
              title: "Pertanyaan",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "jawaban",
              title: "Jawaban",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "pertanyaan", subtitle: "jawaban" } },
        },
      ],
      validation: (r) => r.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: "FAQ" }) },
});
