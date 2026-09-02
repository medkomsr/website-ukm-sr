import {defineField, defineType} from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Pengaturan Situs',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identitas', default: true},
    {name: 'stats', title: 'Statistik'},
    {name: 'contact', title: 'Kontak'},
    {name: 'social', title: 'Media Sosial'},
  ],
  fields: [
    defineField({name: 'namaOrg', title: 'Nama Organisasi', type: 'string', group: 'identity', description: 'Gunakan nama resmi yang tampil di website.', validation: (rule) => rule.required().min(2).max(120)}),
    defineField({name: 'tagline', title: 'Kalimat Singkat Organisasi', type: 'text', rows: 3, group: 'identity', description: 'Kalimat ini tampil di bagian bawah website.', validation: (rule) => rule.required().min(10).max(300)}),
    defineField({name: 'tahunBerdiri', title: 'Tahun Berdiri', type: 'number', group: 'identity', description: 'Gunakan empat digit, misalnya 1998.', validation: (rule) => rule.required().integer().min(1900).max(new Date().getFullYear())}),
    defineField({name: 'jumlahAnggota', title: 'Jumlah Anggota', type: 'number', group: 'stats', description: 'Masukkan angka saja, misalnya 150. Tanda + ditambahkan otomatis di website.', validation: (rule) => rule.required().integer().positive()}),
    defineField({name: 'jumlahPenghargaan', title: 'Jumlah Penghargaan', type: 'number', group: 'stats', description: 'Masukkan angka saja, misalnya 25.', validation: (rule) => rule.required().integer().positive()}),
    defineField({name: 'jumlahKegiatan', title: 'Jumlah Kegiatan per Tahun', type: 'number', group: 'stats', description: 'Masukkan perkiraan jumlah kegiatan dalam setahun, misalnya 50.', validation: (rule) => rule.required().integer().positive()}),
    defineField({name: 'alamat', title: 'Alamat Sekretariat', type: 'text', rows: 3, group: 'contact', description: 'Tuliskan alamat lengkap yang dapat dikunjungi.', validation: (rule) => rule.required().min(10).max(300)}),
    defineField({name: 'telepon', title: 'Nomor Telepon / WhatsApp', type: 'string', group: 'contact', description: 'Gunakan kode negara atau angka lokal, misalnya +62 812-3456-7890.', validation: (rule) => rule.required().regex(/^\+?[0-9][0-9\s()-]{7,20}$/, {name: 'nomor telepon'})}),
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact', description: 'Contoh: senireligi@example.org.', validation: (rule) => rule.required().email()}),
    defineField({name: 'instagram', title: 'Nama akun Instagram', type: 'string', group: 'social', description: 'Contoh: @senireligi_ub.', validation: (rule) => rule.regex(/^@[A-Za-z0-9._]{1,30}$/, {name: 'akun Instagram'}).warning('Gunakan format @namaakun.')}),
    defineField({name: 'instagramUrl', title: 'Tautan Instagram', type: 'url', group: 'social', description: 'Opsional. Tempel tautan lengkap yang diawali https://.', validation: (rule) => rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'youtube', title: 'Nama kanal YouTube', type: 'string', group: 'social', description: 'Opsional. Tulis nama kanal sebagaimana tampil di YouTube.', validation: (rule) => rule.max(120)}),
    defineField({name: 'youtubeUrl', title: 'Tautan YouTube', type: 'url', group: 'social', description: 'Opsional. Tempel tautan lengkap yang diawali https://.', validation: (rule) => rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'facebook', title: 'Nama halaman Facebook', type: 'string', group: 'social', description: 'Opsional. Tulis nama halaman Facebook.', validation: (rule) => rule.max(120)}),
    defineField({name: 'facebookUrl', title: 'Tautan Facebook', type: 'url', group: 'social', description: 'Opsional. Tempel tautan lengkap yang diawali https://.', validation: (rule) => rule.uri({scheme: ['http', 'https']})}),
  ],
  preview: {prepare: () => ({title: 'Pengaturan Situs', subtitle: 'Identitas, kontak, dan media sosial'})},
})
