import {defineField, defineType} from 'sanity'

import {AutoSlugInput} from '../studio/AutoSlugInput'
import {OVERLAY_THEMES} from '../studio/theme'

const memberFields = [
  defineField({name: 'name', title: 'Nama', type: 'string', description: 'Tulis nama lengkap pengurus.', validation: (rule) => rule.required().min(2).max(120)}),
  defineField({name: 'role', title: 'Jabatan', type: 'string', description: 'Opsional. Contoh: Ketua Bidang.', validation: (rule) => rule.max(120)}),
  defineField({name: 'fakultas', title: 'Fakultas', type: 'string', description: 'Opsional. Contoh: Fakultas Ilmu Budaya.', validation: (rule) => rule.max(120)}),
  defineField({name: 'angkatan', title: 'Angkatan', type: 'string', description: 'Opsional. Gunakan tahun masuk empat digit.', validation: (rule) => rule.regex(/^20\d{2}$/, {name: 'tahun 4 digit'}).warning('Gunakan tahun 4 digit, misalnya 2025.')}),
]

export const bidangSchema = defineType({
  name: 'bidang',
  title: 'Bidang Seni',
  type: 'document',
  groups: [
    {name: 'main', title: 'Informasi Utama', default: true},
    {name: 'media', title: 'Media'},
    {name: 'organization', title: 'Pengurus'},
    {name: 'display', title: 'Pengaturan Tampilan'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Jenis Unit',
      type: 'string',
      group: 'main',
      initialValue: 'Bidang',
      readOnly: true,
      description: 'Nilai ini ditetapkan otomatis sebagai Bidang.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'abbr',
      title: 'Singkatan / Nama Pendek',
      type: 'string',
      group: 'main',
      description: 'Contoh: TTQ, DIA, atau KTDAQ.',
      validation: (rule) => rule.required().min(2).max(30),
    }),
    defineField({
      name: 'fullName',
      title: 'Nama Lengkap',
      type: 'string',
      group: 'main',
      description: "Contoh: Tilawah & Tartil Qur'an.",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Alamat halaman (otomatis)',
      type: 'slug',
      group: 'main',
      options: {source: 'abbr'},
      components: {input: AutoSlugInput},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'slugLocked', title: 'Alamat sudah dikunci', type: 'boolean', hidden: true, readOnly: true}),
    defineField({
      name: 'description',
      title: 'Deskripsi Bidang',
      type: 'text',
      rows: 7,
      group: 'main',
      description: 'Teks ini dipakai pada halaman detail dan dipotong otomatis pada kartu.',
      validation: (rule) => rule.required().min(20).max(3000),
    }),
    defineField({
      name: 'image',
      title: 'Foto Utama',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      description: 'Pilih foto mendatar yang paling mewakili bidang.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Deskripsi gambar (untuk aksesibilitas)',
          type: 'string',
          description: 'Jelaskan isi foto dalam satu kalimat.',
          validation: (rule) => rule.required().min(5).max(160),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri Foto',
      type: 'array',
      group: 'media',
      description: 'Opsional. Tambahkan foto kegiatan atau karya bidang.',
      of: [
        defineField({
          name: 'galleryItem',
          title: 'Foto Galeri',
          type: 'object',
          fields: [
            defineField({name: 'image', title: 'Foto', type: 'image', description: 'Unggah satu foto yang tajam dan relevan.', options: {hotspot: true}, validation: (rule) => rule.required()}),
            defineField({name: 'alt', title: 'Deskripsi gambar (untuk aksesibilitas)', type: 'string', description: 'Jelaskan isi foto dalam satu kalimat.', validation: (rule) => rule.required().min(5).max(160)}),
            defineField({name: 'caption', title: 'Keterangan Foto', type: 'string', description: 'Tuliskan konteks atau nama kegiatannya.', validation: (rule) => rule.required().min(2).max(160)}),
          ],
          preview: {select: {title: 'caption', media: 'image'}},
        }),
      ],
    }),
    defineField({name: 'ketuaBidang', title: 'Ketua Bidang', type: 'object', group: 'organization', description: 'Isi data ketua bidang pada periode berjalan.', fields: memberFields}),
    defineField({name: 'wakilKetuaBidang', title: 'Wakil Ketua Bidang', type: 'object', group: 'organization', description: 'Opsional. Isi jika bidang memiliki wakil ketua.', fields: memberFields}),
    defineField({
      name: 'overlayTheme',
      title: 'Warna Lapisan Foto',
      type: 'string',
      group: 'display',
      initialValue: 'green',
      options: {list: [...OVERLAY_THEMES], layout: 'radio'},
      description: 'Pilih warna lapisan yang membuat tulisan di atas foto tetap mudah dibaca.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Urutan Tampil',
      type: 'number',
      group: 'display',
      description: 'Angka lebih kecil tampil lebih awal.',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [{title: 'Urutan Tampil', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'fullName', media: 'image', subtitle: 'abbr'}},
})
