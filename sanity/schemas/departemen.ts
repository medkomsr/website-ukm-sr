import {defineField, defineType} from 'sanity'

import {AutoSlugInput} from '../studio/AutoSlugInput'
import {OVERLAY_THEMES} from '../studio/theme'

const memberFields = [
  defineField({name: 'name', title: 'Nama', type: 'string', description: 'Tulis nama lengkap pengurus.', validation: (rule) => rule.required().min(2).max(120)}),
  defineField({name: 'role', title: 'Jabatan', type: 'string', description: 'Opsional. Contoh: Kepala Departemen.', validation: (rule) => rule.max(120)}),
  defineField({name: 'fakultas', title: 'Fakultas', type: 'string', description: 'Opsional. Contoh: Fakultas Ilmu Budaya.', validation: (rule) => rule.max(120)}),
  defineField({name: 'angkatan', title: 'Angkatan', type: 'string', description: 'Opsional. Gunakan tahun masuk empat digit.', validation: (rule) => rule.regex(/^20\d{2}$/, {name: 'tahun 4 digit'}).warning('Gunakan tahun 4 digit, misalnya 2025.')}),
]

export const departemenSchema = defineType({
  name: 'departemen',
  title: 'Departemen / Badan',
  type: 'document',
  groups: [
    {name: 'main', title: 'Informasi Utama', default: true},
    {name: 'program', title: 'Program Kerja'},
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
      options: {list: [{title: 'Badan', value: 'Badan'}, {title: 'Departemen', value: 'Departemen'}], layout: 'radio'},
      description: 'Pilih bentuk unit sesuai struktur organisasi.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'abbr', title: 'Singkatan', type: 'string', group: 'main', description: 'Contoh: PSDM atau Medinfo.', validation: (rule) => rule.required().min(2).max(30)}),
    defineField({name: 'fullName', title: 'Nama Lengkap', type: 'string', group: 'main', description: 'Tuliskan nama resmi unit tanpa singkatan.', validation: (rule) => rule.required().min(2).max(120)}),
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
      title: 'Deskripsi Departemen / Badan',
      type: 'text',
      rows: 7,
      group: 'main',
      description: 'Jelaskan fungsi, sasaran, dan lingkup kerja unit.',
      validation: (rule) => rule.required().min(20).max(3000),
    }),
    defineField({
      name: 'image',
      title: 'Foto Utama',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      description: 'Pilih foto mendatar yang paling mewakili unit.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({name: 'alt', title: 'Deskripsi gambar (untuk aksesibilitas)', type: 'string', description: 'Jelaskan isi foto dalam satu kalimat.', validation: (rule) => rule.required().min(5).max(160)}),
      ],
    }),
    defineField({
      name: 'programItems',
      title: 'Daftar Program Kerja',
      type: 'array',
      group: 'program',
      description: 'Tambahkan nama program dan keterangannya dalam satu kartu.',
      of: [
        defineField({
          name: 'programItem',
          title: 'Program Kerja',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Nama Program', type: 'string', description: 'Contoh: Pelatihan Anggota Baru.', validation: (rule) => rule.required().min(2).max(120)}),
            defineField({name: 'description', title: 'Deskripsi Program', type: 'text', rows: 4, description: 'Jelaskan tujuan dan bentuk kegiatan program.', validation: (rule) => rule.required().min(10).max(1000)}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({name: 'kepala', title: 'Kepala Departemen / Badan', type: 'object', group: 'organization', description: 'Isi data kepala unit pada periode berjalan.', fields: memberFields}),
    defineField({
      name: 'divisi',
      title: 'Divisi di Dalam Unit',
      type: 'array',
      group: 'organization',
      description: 'Opsional. Tambahkan hanya divisi yang berada di dalam unit ini.',
      of: [
        defineField({
          name: 'departmentDivision',
          title: 'Divisi',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Nama Divisi', type: 'string', description: 'Tuliskan nama lengkap divisi.', validation: (rule) => rule.required().min(2).max(120)}),
            defineField({name: 'kepala', title: 'Kepala Divisi', type: 'object', description: 'Isi data penanggung jawab divisi.', fields: memberFields}),
            defineField({name: 'staff', title: 'Staf', type: 'array', description: 'Opsional. Tambahkan anggota staf satu per satu.', of: [defineField({name: 'staffMember', title: 'Anggota Staf', type: 'object', fields: memberFields})]}),
          ],
          preview: {select: {title: 'name'}},
        }),
      ],
    }),
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
    defineField({name: 'order', title: 'Urutan Tampil', type: 'number', group: 'display', description: 'Gunakan 0 untuk urutan pertama; angka lebih kecil tampil lebih awal.', validation: (rule) => rule.required().integer().min(0)}),
  ],
  orderings: [{title: 'Urutan Tampil', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'fullName', media: 'image', subtitle: 'abbr'}},
})
