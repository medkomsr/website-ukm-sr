import { defineField, defineType } from "sanity"

export const kaligrafiSettingsSchema = defineType({
  name: "kaligrafiSettings",
  title: "Pengaturan Katalog Kaligrafi",
  type: "document",
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "Nomor WhatsApp Admin",
      type: "string",
      description: "Gunakan format internasional tanpa tanda +, spasi, atau tanda baca. Contoh: 6281234567890.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[1-9]\d{7,14}$/, {
            name: "nomor WhatsApp internasional",
            invert: false,
          })
          .error("Masukkan 8–15 digit tanpa tanda +, spasi, atau tanda baca."),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Pengaturan Katalog Kaligrafi" }
    },
  },
})
