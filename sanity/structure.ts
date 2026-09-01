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
      S.listItem()
        .title('Katalog Kaligrafi')
        .id('kaligrafiCatalog')
        .child(
          S.list()
            .title('Katalog Kaligrafi')
            .items([
              S.listItem()
                .title('Pengaturan')
                .id('kaligrafiSettings')
                .child(
                  S.document()
                    .schemaType('kaligrafiSettings')
                    .documentId('kaligrafiSettings')
                ),
              S.divider(),
              S.listItem()
                .title('Karya Tersedia')
                .id('kaligrafiAvailable')
                .child(
                  S.documentList()
                    .title('Karya Tersedia')
                    .schemaType('kaligrafiItem')
                    .filter('_type == "kaligrafiItem" && status == "available"')
                    .defaultOrdering([
                      { field: 'displayOrder', direction: 'asc' },
                      { field: '_createdAt', direction: 'desc' },
                    ])
                ),
              S.listItem()
                .title('Karya Terjual')
                .id('kaligrafiSold')
                .child(
                  S.documentList()
                    .title('Karya Terjual')
                    .schemaType('kaligrafiItem')
                    .filter('_type == "kaligrafiItem" && status == "sold"')
                    .defaultOrdering([{ field: 'soldAt', direction: 'desc' }])
                ),
              S.documentTypeListItem('kaligrafiItem').title('Semua Karya'),
              S.documentTypeListItem('kaligrafiCategory').title('Kategori'),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('event').title('Kegiatan'),
      S.documentTypeListItem('artikel').title('Artikel'),
      S.documentTypeListItem('divisi').title('Divisi Seni'),
      S.documentTypeListItem('galeri').title('Galeri'),
      S.documentTypeListItem('departemen').title('Departemen'),
      S.documentTypeListItem('faq').title('FAQ'),
    ])
