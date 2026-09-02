import {defineField, defineType} from 'sanity'

import {AutoSlugInput, isUniqueActivitySlug} from '../studio/AutoSlugInput'

export const artikelSchema = defineType({
  name: 'artikel',
  title: 'Artikel',
  type: 'document',
  groups: [
    {name: 'main', title: 'Informasi Utama', default: true},
    {name: 'media', title: 'Media'},
    {name: 'content', title: 'Isi'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Artikel',
      type: 'string',
      group: 'main',
      description: 'Gunakan judul yang jelas, spesifik, dan mudah dicari.',
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Alamat halaman (otomatis)',
      type: 'slug',
      group: 'main',
      options: {source: 'title', isUnique: isUniqueActivitySlug},
      components: {input: AutoSlugInput},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'slugLocked', title: 'Alamat sudah dikunci', type: 'boolean', hidden: true, readOnly: true}),
    defineField({
      name: 'description',
      title: 'Ringkasan untuk Kartu',
      type: 'text',
      rows: 4,
      group: 'main',
      description: 'Ringkasan singkat yang tampil pada kartu artikel, 20–240 karakter.',
      validation: (rule) => rule.required().min(20).max(240),
    }),
    defineField({
      name: 'image',
      title: 'Foto Utama',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      description: 'Pilih foto mendatar yang mewakili isi artikel.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Deskripsi gambar (untuk aksesibilitas)',
          type: 'string',
          description: 'Jelaskan isi foto dalam satu kalimat, tanpa menulis “gambar tentang”.',
          validation: (rule) => rule.required().min(5).max(160),
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      group: 'main',
      description: 'Pilih kategori yang paling sesuai dengan isi artikel.',
      options: {
        list: ['Prestasi', 'Liputan', 'Pengumuman', 'Berita'].map((value) => ({title: value, value})),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tanggal Terbit',
      type: 'date',
      group: 'main',
      options: {dateFormat: 'DD MMMM YYYY'},
      description: 'Pilih tanggal melalui kalender. Nilai disimpan dalam format yang konsisten.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Perkiraan Waktu Baca (opsional)',
      type: 'string',
      group: 'main',
      description: 'Contoh: 5 menit.',
      validation: (rule) =>
        rule.custom((value) => !value || /^\d+\s+menit$/i.test(value) || 'Gunakan format seperti “5 menit”.'),
    }),
    defineField({
      name: 'author',
      title: 'Penulis',
      type: 'object',
      group: 'content',
      description: 'Cantumkan orang atau tim yang bertanggung jawab atas tulisan.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'name',
          title: 'Nama Penulis',
          type: 'string',
          description: 'Contoh: Tim Media UKM Seni Religi.',
          validation: (rule) => rule.required().min(2).max(120),
        }),
        defineField({
          name: 'role',
          title: 'Jabatan / Peran',
          type: 'string',
          description: 'Opsional. Contoh: Staf Media dan Informasi.',
          validation: (rule) => rule.max(120),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Isi Artikel',
      type: 'array',
      group: 'content',
      description: 'Tuliskan isi lengkap artikel. Gunakan heading untuk membagi bagian.',
      of: [{type: 'block'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      title: 'Kata Kunci',
      type: 'array',
      group: 'content',
      description: 'Opsional. Tambahkan maksimal 10 kata kunci untuk membantu pengelompokan.',
      of: [{type: 'string', validation: (rule) => rule.min(2).max(40)}],
      validation: (rule) => rule.unique().max(10),
    }),
  ],
  orderings: [
    {title: 'Terbaru', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Terlama', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', media: 'image', category: 'category', date: 'date'},
    prepare({title, media, category, date}) {
      return {title, media, subtitle: [date, category].filter(Boolean).join(' · ')}
    },
  },
})
