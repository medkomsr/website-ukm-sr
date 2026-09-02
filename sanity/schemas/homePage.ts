import {defineField, defineType} from 'sanity'

export const homePageSchema = defineType({
  name: 'homePage',
  title: 'Halaman Beranda',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Bagian Pembuka', default: true},
    {name: 'about', title: 'Tentang Organisasi'},
    {name: 'division', title: 'Bidang Seni'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Bagian Pembuka Beranda',
      type: 'object',
      group: 'hero',
      validation: (rule) => rule.required(),
      fields: [
        defineField({name: 'judul1', title: 'Judul baris pertama', type: 'string', description: 'Contoh: Seni yang', validation: (rule) => rule.required().min(2).max(80)}),
        defineField({name: 'judulHighlight', title: 'Kata yang diberi warna emas', type: 'string', description: 'Contoh: Menginspirasi', validation: (rule) => rule.required().min(2).max(50)}),
        defineField({name: 'judul2', title: 'Judul baris kedua', type: 'string', description: 'Contoh: Iman yang Menguatkan', validation: (rule) => rule.required().min(2).max(80)}),
        defineField({name: 'deskripsi', title: 'Deskripsi pembuka', type: 'text', rows: 3, description: 'Ringkas tujuan organisasi dalam satu atau dua kalimat.', validation: (rule) => rule.required().min(20).max(300)}),
        defineField({name: 'ctaText', title: 'Teks tombol ajakan', type: 'string', description: 'Contoh: Kenali Kami', validation: (rule) => rule.required().min(2).max(40)}),
      ],
    }),
    defineField({
      name: 'about',
      title: 'Bagian Tentang Organisasi',
      type: 'object',
      group: 'about',
      validation: (rule) => rule.required(),
      fields: [
        defineField({name: 'judul1', title: 'Judul sebelum kata sorotan', type: 'string', description: 'Contoh: Mengenal lebih dekat', validation: (rule) => rule.required().min(2).max(100)}),
        defineField({name: 'judulHighlight', title: 'Kata yang disorot', type: 'string', description: 'Contoh: UKM Seni Religi', validation: (rule) => rule.required().min(2).max(60)}),
        defineField({name: 'deskripsi1', title: 'Paragraf pertama', type: 'text', rows: 4, description: 'Jelaskan gambaran umum organisasi.', validation: (rule) => rule.required().min(20).max(1000)}),
        defineField({name: 'deskripsi2', title: 'Paragraf kedua', type: 'text', rows: 4, description: 'Lanjutkan dengan kegiatan atau nilai utama organisasi.', validation: (rule) => rule.required().min(20).max(1000)}),
        defineField({
          name: 'highlights',
          title: 'Poin Keunggulan',
          type: 'array',
          description: 'Contoh: 150+ Anggota dari Seluruh Fakultas.',
          of: [{type: 'string', validation: (rule) => rule.required().min(2).max(120)}],
          validation: (rule) => rule.required().min(1).max(6).unique(),
        }),
      ],
    }),
    defineField({
      name: 'divisions',
      title: 'Pengantar Bidang Seni',
      type: 'object',
      group: 'division',
      validation: (rule) => rule.required(),
      fields: [
        defineField({name: 'heading', title: 'Judul bagian', type: 'string', description: 'Contoh: Jelajahi Cabang Seni Religi', validation: (rule) => rule.required().min(2).max(100)}),
        defineField({name: 'subheading', title: 'Penjelasan singkat', type: 'text', rows: 3, description: 'Jelaskan isi bagian ini dalam satu kalimat.', validation: (rule) => rule.required().min(10).max(300)}),
      ],
    }),
    defineField({
      name: 'featuredBidang',
      title: 'Bidang Unggulan di Beranda',
      type: 'array',
      group: 'division',
      description: 'Pilih maksimal tiga bidang. Jika kosong, tiga bidang dengan urutan terkecil akan digunakan.',
      of: [{type: 'reference', to: [{type: 'bidang'}]}],
      validation: (rule) => rule.unique().max(3),
    }),
  ],
  preview: {prepare: () => ({title: 'Halaman Beranda', subtitle: 'Konten utama beranda website'})},
})
