import type {StructureResolver} from 'sanity/structure'

import {AdminGuidePane} from './studio/AdminGuidePane'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kelola Konten')
    .items([
      S.listItem()
        .title('Panduan Admin')
        .id('adminGuide')
        .child(S.component(AdminGuidePane).id('adminGuidePane').title('Panduan Admin')),
      S.divider(),
      S.listItem()
        .title('Pengaturan & Halaman')
        .child(
          S.list()
            .title('Pengaturan & Halaman')
            .items([
              S.listItem()
                .title('Pengaturan Situs')
                .id('siteSettings')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Halaman Beranda')
                .id('homePage')
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('Visi & Misi')
                .id('visiMisi')
                .child(S.document().schemaType('visiMisi').documentId('visiMisi')),
            ]),
        ),
      S.listItem()
        .title('Aktivitas & Prestasi')
        .child(
          S.list()
            .title('Aktivitas & Prestasi')
            .items([
              S.documentTypeListItem('event').title('Kegiatan'),
              S.documentTypeListItem('artikel').title('Artikel'),
              S.documentTypeListItem('prestasi').title('Prestasi'),
            ]),
        ),
      S.listItem()
        .title('Organisasi')
        .child(
          S.list()
            .title('Organisasi')
            .items([
              S.documentTypeListItem('bidang').title('Bidang Seni'),
              S.documentTypeListItem('departemen').title('Departemen / Badan'),
            ]),
        ),
      S.listItem()
        .title('Konten Pendukung')
        .child(
          S.list()
            .title('Konten Pendukung')
            .items([
              S.documentTypeListItem('galeri').title('Galeri'),
              S.documentTypeListItem('faq').title('Pertanyaan Umum'),
            ]),
        ),
    ])
