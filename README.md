# Website UKM Seni Religi UB

Website publik dan Sanity Studio untuk pengelolaan konten UKM Seni Religi Universitas Brawijaya.

## Panduan admin

- [Panduan sumber Markdown](docs/panduan-admin-sanity.md)
- [Panduan PDF publik](public/panduan-admin-sanity.pdf)

PDF juga dapat dibuka dari menu **Panduan Admin** di Sanity Studio.

## Menjalankan proyek

Salin `.env.example` menjadi `.env.local`, isi konfigurasi project Sanity, lalu jalankan:

```bash
npm install
npm run dev
```

Website tersedia di `http://localhost:3000` dan Studio di `http://localhost:3000/studio`.

## Validasi perubahan

```bash
npm test
npx tsc --noEmit --incremental false
npx sanity schemas validate --level warning
npm run lint
npm run build
```

Repositori masih memiliki beberapa temuan lint lama di komponen yang tidak terkait. Perubahan baru tidak boleh menambah error lint.

## Migrasi konten Sanity

Mode default hanya membaca data dan menampilkan rencana perubahan:

```bash
npm run sanity:migrate:dry
```

Sebelum mode apply, ekspor backup dataset. Ganti tanggal pada nama file agar setiap backup mudah dikenali:

```bash
npx sanity dataset export production tmp/sanity-backups/pre-admin-ux-YYYY-MM-DD.tar.gz
```

Perubahan produksi hanya boleh dijalankan setelah laporan dry-run ditinjau dan semua tanggal, waktu, atau angka statistik yang tidak valid diperbaiki; konten aktivitas yang tidak akan dipakai dapat di-unpublish.

```bash
npx tsx scripts/sanity-content-migration.ts --apply --backup-confirmed
```

Mode apply memerlukan `SANITY_API_WRITE_TOKEN`. Script bersifat idempotent dan tidak menebak tanggal yang tidak valid.

## Revalidasi setelah publish

Atur webhook Sanity ke:

```text
POST https://<domain>/api/revalidate/sanity
```

Webhook wajib memakai secret yang sama dengan `SANITY_REVALIDATE_SECRET` dan projection berikut:

```groq
{
  "_id": _id,
  "_type": _type,
  "projectId": sanity::projectId(),
  "dataset": sanity::dataset(),
  "operation": delta::operation()
}
```

Endpoint memverifikasi signature, project, dataset, operasi, dan allowlist tipe dokumen sebelum mengosongkan cache terkait.
