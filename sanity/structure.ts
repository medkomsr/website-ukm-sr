import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Konten')
    .items([
      S.listItem().title('Pengaturan Situs').id('siteSettings').child(
        S.document().schemaType('siteSettings').documentId('siteSettings')
      ),
      S.listItem().title('Halaman Beranda').id('homePage').child(
        S.document().schemaType('homePage').documentId('homePage')
      ),
      S.listItem().title('Visi & Misi').id('visiMisi').child(
        S.document().schemaType('visiMisi').documentId('visiMisi')
      ),
      S.divider(),
      S.documentTypeListItem('event').title('Kegiatan'),
      S.documentTypeListItem('artikel').title('Artikel'),
      S.documentTypeListItem('divisi').title('Divisi Seni'),
      S.documentTypeListItem('galeri').title('Galeri'),
      S.documentTypeListItem('departemen').title('Departemen'),
      S.documentTypeListItem('faq').title('FAQ'),
    ])
