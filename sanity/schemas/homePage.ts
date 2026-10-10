import { defineField, defineType } from "sanity";

export const homePageSchema = defineType({
  name: "homePage",
  title: "Halaman Beranda",
  type: "document",
  preview: { prepare: () => ({ title: "Beranda" }) },
  fieldsets: [
    {
      name: "companyProfile",
      title: "Video Company Profile",
      description:
        "Kartu video di beranda selalu tampil. Jika video dikosongkan, tombol putar menampilkan pesan bahwa video belum tersedia; jika sampul dikosongkan, gambar bawaan dipakai.",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "news",
      title: "Berita & Acara di Beranda",
      description:
        "Beranda menampilkan 3 berita. Berita pilihan tampil lebih dulu sesuai urutan; slot yang kosong otomatis diisi berita terbaru.",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "achievements",
      title: "Prestasi di Beranda",
      description:
        "Beranda menampilkan 5 prestasi. Prestasi pilihan tampil lebih dulu sesuai urutan; slot yang kosong otomatis diisi prestasi terbaru.",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "companyVideoFile",
      title: "Unggah video (MP4 / WebM)",
      description:
        "Diutamakan bila terisi. Kompres video terlebih dahulu agar cepat dimuat. Hapus file untuk kembali memakai tautan di bawah.",
      type: "file",
      fieldset: "companyProfile",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "companyVideoUrl",
      title: "Tautan video (YouTube / MP4 / WebM)",
      description:
        "Dipakai bila tidak ada video yang diunggah. Contoh: https://youtu.be/xxxxxxxxxxx",
      type: "url",
      fieldset: "companyProfile",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "companyVideoPoster",
      title: "Sampul video",
      description: "Gambar pada kartu video. Kosongkan untuk memakai gambar bawaan.",
      type: "image",
      fieldset: "companyProfile",
      options: { hotspot: true },
    }),
    defineField({
      name: "sorotanBerita",
      title: "Sorotan berita (opsional)",
      description: "Pilih maksimal 3. Kosongkan untuk menampilkan 3 berita terbaru.",
      type: "array",
      fieldset: "news",
      of: [{ type: "reference", to: [{ type: "beritaAcara" }], weak: true }],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: "sorotanPrestasi",
      title: "Sorotan prestasi (opsional)",
      description: "Pilih maksimal 5. Kosongkan untuk menampilkan 5 prestasi terbaru.",
      type: "array",
      fieldset: "achievements",
      of: [{ type: "reference", to: [{ type: "prestasi" }], weak: true }],
      validation: (Rule) => Rule.max(5).unique(),
    }),
  ],
});
