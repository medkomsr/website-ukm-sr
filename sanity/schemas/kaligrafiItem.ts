import { defineField, defineType } from "sanity"
import { apiVersion } from "../env"

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

export const kaligrafiItemSchema = defineType({
  name: "kaligrafiItem",
  title: "Karya Kaligrafi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nama Karya",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Kode Barang",
      type: "string",
      description: "Kode unik karya. Contoh: KLG-001.",
      validation: (rule) =>
        rule.required().custom(async (code, context) => {
          if (typeof code !== "string") return true

          if (code.trim() !== code || code.length === 0) {
            return "Kode barang tidak boleh kosong atau memiliki spasi di awal/akhir."
          }

          if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(code)) {
            return "Gunakan hanya huruf, angka, titik, garis bawah, garis miring, atau tanda hubung."
          }

          const documentId = context.document?._id?.replace(/^drafts\./, "") ?? ""
          const isUnique = await context.getClient({ apiVersion }).fetch<boolean>(
            `count(*[
              _type == "kaligrafiItem" &&
              lower(code) == lower($code) &&
              !(_id in [$publishedId, $draftId])
            ]) == 0`,
            {
              code,
              publishedId: documentId,
              draftId: `drafts.${documentId}`,
            }
          )

          return isUnique || "Kode barang sudah digunakan oleh karya lain."
        }),
    }),
    defineField({
      name: "image",
      title: "Foto Karya",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Teks Alternatif Foto",
      type: "string",
      description: "Deskripsikan isi foto secara singkat untuk aksesibilitas.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "kaligrafiCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Harga",
      type: "number",
      description: "Masukkan harga dalam Rupiah tanpa titik atau pemisah ribuan.",
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "description",
      title: "Keterangan",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "available",
      options: {
        layout: "radio",
        list: [
          { title: "Tersedia", value: "available" },
          { title: "Terjual", value: "sold" },
        ],
      },
      validation: (rule) =>
        rule.required().custom((status) => {
          if (status === undefined) return true

          return status === "available" || status === "sold" || "Status karya tidak valid."
        }),
    }),
    defineField({
      name: "soldAt",
      title: "Tanggal Terjual",
      type: "date",
      hidden: ({ document }) => document?.status !== "sold",
      validation: (rule) =>
        rule.custom((soldAt, context) => {
          if (context.document?.status === "sold" && !soldAt) {
            return "Tanggal terjual wajib diisi ketika status karya Terjual."
          }

          return true
        }),
    }),
    defineField({
      name: "displayOrder",
      title: "Urutan Tampil",
      type: "number",
      description: "Angka lebih kecil ditampilkan lebih awal.",
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Urutan Tampil",
      name: "displayOrderAsc",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
    {
      title: "Terbaru Dibuat",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      code: "code",
      status: "status",
      category: "category.name",
      price: "price",
      media: "image",
    },
    prepare({ title, code, status, category, price, media }) {
      const availability = status === "sold" ? "Terjual" : "Tersedia"
      const formattedPrice = typeof price === "number" ? rupiahFormatter.format(price) : "Harga belum diisi"

      return {
        title,
        subtitle: [code, category, formattedPrice, availability].filter(Boolean).join(" · "),
        media,
      }
    },
  },
})
