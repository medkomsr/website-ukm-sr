import {defineField, defineType} from 'sanity'

import {AutoSlugInput, isUniqueActivitySlug} from '../studio/AutoSlugInput'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const eventSchema = defineType({
  name: 'event',
  title: 'Kegiatan',
  type: 'document',
  groups: [
    {name: 'main', title: 'Informasi Utama', default: true},
    {name: 'schedule', title: 'Jadwal'},
    {name: 'media', title: 'Media'},
    {name: 'content', title: 'Isi'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Kegiatan',
      type: 'string',
      group: 'main',
      description: 'Gunakan judul yang jelas dan mudah dikenali pengunjung.',
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
      title: 'Deskripsi Kegiatan',
      type: 'text',
      rows: 8,
      group: 'content',
      description: 'Tampil di kartu dan halaman detail. Kartu akan memotong teks secara otomatis.',
      validation: (rule) => rule.required().min(20).max(3000),
    }),
    defineField({
      name: 'image',
      title: 'Foto Utama',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      description: 'Pilih foto mendatar yang mewakili kegiatan.',
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
      description: 'Pilih kategori yang paling sesuai dengan bentuk kegiatan.',
      options: {
        list: ['Festival', 'Workshop', 'Lomba', 'Rutin', 'Pengumuman'].map((value) => ({title: value, value})),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tanggal Mulai',
      type: 'date',
      group: 'schedule',
      options: {dateFormat: 'DD MMMM YYYY'},
      description: 'Pilih melalui kalender. Untuk kegiatan rutin, buat satu dokumen untuk setiap pelaksanaan.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Tanggal Selesai (opsional)',
      type: 'date',
      group: 'schedule',
      options: {dateFormat: 'DD MMMM YYYY'},
      description: 'Isi hanya jika kegiatan berlangsung lebih dari satu hari.',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return true
          const startDate = (context.parent as {date?: string} | undefined)?.date
          if (!startDate || value >= startDate) return true
          return 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.'
        }),
    }),
    defineField({
      name: 'time',
      title: 'Waktu Mulai (opsional)',
      type: 'string',
      group: 'schedule',
      description: 'Gunakan format 24 jam, misalnya 08:30 atau 19:00.',
      validation: (rule) =>
        rule.custom((value) => !value || TIME_PATTERN.test(value) || 'Gunakan format waktu HH:mm, misalnya 08:30.'),
    }),
    defineField({
      name: 'location',
      title: 'Lokasi (opsional)',
      type: 'string',
      group: 'schedule',
      description: 'Contoh: Gedung Samantha Krida atau daring melalui Zoom.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'status',
      title: 'Status Kegiatan',
      type: 'string',
      group: 'schedule',
      initialValue: 'upcoming',
      description: 'Perbarui status sesuai tahap pelaksanaan kegiatan.',
      options: {
        list: [
          {title: 'Akan Datang', value: 'upcoming'},
          {title: 'Sedang Berlangsung', value: 'ongoing'},
          {title: 'Selesai', value: 'completed'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organizer',
      title: 'Penyelenggara (opsional)',
      type: 'string',
      group: 'main',
      description: 'Contoh: Bidang Hadrah UKM Seni Religi.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Kapasitas Peserta (opsional)',
      type: 'number',
      group: 'schedule',
      description: 'Masukkan bilangan bulat lebih dari nol jika peserta dibatasi.',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'agenda',
      title: 'Agenda / Susunan Acara',
      type: 'array',
      group: 'content',
      description: 'Opsional. Tambahkan agenda secara berurutan.',
      of: [
        defineField({
          name: 'agendaItem',
          title: 'Agenda',
          type: 'object',
          fields: [
            defineField({
              name: 'time',
              title: 'Waktu',
              type: 'string',
              description: 'Format HH:mm, misalnya 09:00.',
              validation: (rule) =>
                rule.required().custom((value) => TIME_PATTERN.test(value ?? '') || 'Gunakan format HH:mm.'),
            }),
            defineField({
              name: 'item',
              title: 'Nama Acara',
              type: 'string',
              description: 'Contoh: Pembukaan dan tilawah.',
              validation: (rule) => rule.required().min(2).max(120),
            }),
          ],
          preview: {select: {title: 'time', subtitle: 'item'}},
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Kata Kunci',
      type: 'array',
      group: 'content',
      description: 'Opsional. Maksimal 10 kata kunci untuk membantu pengelompokan.',
      of: [{type: 'string', validation: (rule) => rule.min(2).max(40)}],
      validation: (rule) => rule.unique().max(10),
    }),
  ],
  orderings: [
    {title: 'Tanggal Terbaru', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Tanggal Terlama', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', media: 'image', date: 'date', status: 'status'},
    prepare({title, media, date, status}) {
      const statusLabel = {upcoming: 'Akan Datang', ongoing: 'Berlangsung', completed: 'Selesai'}[
        status as 'upcoming' | 'ongoing' | 'completed'
      ]
      return {title, media, subtitle: [date, statusLabel].filter(Boolean).join(' · ')}
    },
  },
})
