# Data demo Sanity

`seed-demo-content.mjs` menambahkan 5 berita, 5 acara, dan 10 prestasi. Setiap berita/acara memiliki 1 foto utama dan 4 foto tambahan, sehingga bagian Dokumentasi menampilkan 5 foto. Lima aset gambar dipakai bergantian di seluruh contoh.

Judul memakai awalan `[Demo]` dan ID memakai `demo-sr-2026-`. Semua cerita, pencapaian, peserta, lokasi, dan jadwal merupakan simulasi. Gambar berasal dari cuplikan company profile SR 2025 dan hanya menjadi ilustrasi, bukan bukti acara atau prestasi.

Lihat rencana tanpa mengubah dataset:

```powershell
node scripts/seed-demo-content.mjs
```

Untuk pengisian awal, siapkan folder berisi `sr-demo-2026-01.jpg` sampai `sr-demo-2026-05.jpg`. Gunakan sesi login Sanity CLI yang memiliki izin menulis:

```powershell
node node_modules/@sanity/cli/bin/run.js exec scripts/seed-demo-content.mjs --with-user-token -- --apply --images-dir "C:\path\ke\gambar"
```

Perintah membaca project dan dataset dari `.env.local`, lalu membuat dokumen **published** agar dapat terlihat di website. Tidak ada token yang disimpan dalam skrip. Dokumen asli tidak diubah. Pengulangan melewati ID yang sudah ada, termasuk draft, sehingga perubahan editor tidak ditimpa. Aset dengan nama yang sama digunakan kembali; jika semua aset sudah tersedia, `--images-dir` boleh dihilangkan.

Periksa dan edit data lewat menu **Berita & Acara** dan **Prestasi** di Studio. Untuk membersihkan contoh, cari judul `[Demo]` di kedua menu tersebut; jangan menghapus dokumen atau gambar asli. Halaman frontend menggunakan cache, sehingga pembaruan mungkin memerlukan penyegaran cache atau restart server pengembangan.

## Halaman Tentang

`seed-about-demo.ts` mengisi 4 departemen dan 8 bidang memakai ID yang sama dengan menu bawaan Studio. Departemen memiliki thumbnail kartu, 3 program kerja, dan 4 pengurus. Teks pembukanya tetap dari frontend. Bidang memiliki thumbnail kartu, deskripsi bidang, ketua/wakil, dan 5 foto dokumentasi. Teks pembuka singkatnya tetap dari frontend. Thumbnail hanya dipakai pada kartu Tentang Kami, bukan sebagai gambar besar di detail. Nama pengurus ditandai `(Demo)`; foto adalah ilustrasi. Visi-misi berisi kalimat contoh yang wajar, untuk diganti dengan rumusan resmi melalui CMS.

```powershell
# Tinjau rencana dahulu
node node_modules/@sanity/cli/bin/run.js exec scripts/seed-about-demo.ts --with-user-token
# Terapkan dengan cadangan baru (file cadangan yang sudah ada tidak ditimpa)
node node_modules/@sanity/cli/bin/run.js exec scripts/seed-about-demo.ts --with-user-token -- --apply --backup "C:\path\ke\about-before.json"
```

Skrip memakai kembali lima aset demo. Dokumen yang sudah memiliki ID baku tidak ditimpa. Dua dokumen demo lama BKRT/KTDAQ dipindahkan ke ID baku setelah pemeriksaan referensi; draft kerangka yang kosong pada ID tujuan dibersihkan. Draft berisi konten menghentikan proses agar dapat ditinjau. Visi-misi hanya diganti apabila masih berisi placeholder teks acak awal. Company profile tidak termasuk seed ini.

Arsip berita dan prestasi mengambil maksimal 9 dokumen per halaman desktop. Pada mobile, daftar vertikal menampilkan 5 item awal; tombol Lihat lebih banyak mengambil 5 item berikutnya dan Lihat lebih sedikit mengembalikan tampilan ke 5 item. Filter dan pencarian diterapkan sebelum pemotongan hasil. Metadata filter dan jumlah total diambil terpisah; beranda memakai query sorotan yang terbatas. Halaman contoh prestasi lama mengarah ke arsip Sanity.

`remove-department-intro.ts` membersihkan field deskripsi pembuka lama pada empat departemen, termasuk draft terkait. Default hanya menampilkan rencana; gunakan `--apply --backup <file-baru>` melalui Sanity CLI untuk menerapkan. Dokumen dicadangkan terlebih dahulu dan revision diperiksa agar perubahan editor tidak tertimpa. Thumbnail, foto pengurus, program kerja, dan deskripsi bidang tetap disimpan.

Deskripsi bidang wajib berisi satu paragraf, maksimal 50 kata dan 350 karakter termasuk spasi. `shorten-demo-field-descriptions.ts` merapikan hanya teks yang sama persis dengan seed lama; perubahan editor dilewati. Jalankan melalui Sanity CLI dengan `--apply --backup <file-baru>` untuk menerapkan setelah pencadangan.

## Audit dan pembersihan backend

`audit-sanity.ts` memeriksa jumlah dokumen, slug ganda, dokumen singleton, serta referensi ke tipe lama. Hanya membaca data.

`cleanup-legacy-sanity.ts` menghapus tipe yang sudah dihentikan: `artikel`, `event`, `galeri`, `divisi`, `kaligrafiItem`, `kaligrafiCategory`, `kaligrafiSettings`, dan `siteSettings`. Jalankan tanpa `--apply` untuk melihat rencana. Penerapan memerlukan `--apply --backup <file-baru.ndjson>` melalui Sanity CLI. Cadangan lengkap disimpan sebelum transaksi; referensi dari dokumen aktif membatalkan operasi; revisi yang berubah tidak dihapus. Aset gambar/video tetap disimpan. NDJSON dapat diimpor kembali jika perlu pemulihan.

Skrip `seed-demo-profiles.mjs` dihentikan karena memakai ID nonbaku untuk BKRT/KTDAQ. Gunakan `seed-about-demo.ts`. Identitas kabinet sekarang dibaca langsung oleh `getKabinet`, tanpa query `siteSettings` lama.

## Keamanan dan validasi CMS

Validator bersama ada di sanity/validation.ts. Batas publikasi: judul 120 karakter, ringkasan 350, nama 100, visi 500, misi 1–10 butir @250, FAQ 150/700, slug 96, galeri bidang 10 dan galeri berita 9 foto tambahan (10 bersama foto utama), program/pengurus/rundown 30, peserta prestasi 50, tag 10. Isi berita maksimal 200 blok. Gambar maksimal 5 MiB, 128–12.000 piksel per sisi, JPG/PNG/WebP/AVIF. Pemeriksaan gambar dilakukan sebelum publish; Sanity mengunggah aset sebelum validasi ini, sehingga bukan pembatas kuota upload di server.

Data lama tidak dimutasi atau dipotong. Deskripsi prestasi demo 01, 04, 05, 07, 08, 09, 10 melewati batas baru; editor harus merangkum sebelum publish ulang. Draft departemen c8dd3137-ca2d-48d9-9278-1f6a981ada8c belum memiliki nama/slug. Company profile (schema, video, sampul, player) dikecualikan dari perubahan. Menu profil tambahan tetap bisa membaca dokumen lama tetapi tidak menawarkan pembuatan/duplikasi profil di luar struktur frontend.

Validasi Studio tidak berlaku untuk mutation API; skrip impor wajib memvalidasi input sendiri dan menjalankan pemeriksaan dataset setelahnya. Jangan menjalankan skrip seed/cleanup untuk menerapkan perubahan keamanan ini. Untuk audit baca saja:

```powershell
node node_modules/@sanity/cli/bin/run.js documents validate --yes --format ndjson --level info
```

### Aktivasi webhook setelah deployment

Endpoint POST /api/sanity/revalidate memverifikasi signature dari @sanity/webhook terhadap body asli (maksimal 16 KiB), hanya menerima tipe dokumen yang diizinkan, dan mengabaikan draft/versi rilis. Menggunakan revalidateTag(tag, { expire: 0 }). Pembacaan CMS melewati Sanity API CDN karena Next sudah menyimpan cache hasil; ini mencegah data CDN lama masuk lagi setelah invalidasi.

1. Buat secret acak minimal 32 karakter. Isi SANITY_REVALIDATE_SECRET di environment server Vercel, bukan NEXT_PUBLIC dan jangan commit nilainya.
2. Deploy aplikasi sebelum mengaktifkan webhook. Tambahkan webhook Sanity menuju https://website-ukm-sr.vercel.app/api/sanity/revalidate, dataset production, metode POST, trigger create/update/delete; drafts dan versions nonaktif. Masukkan secret yang sama pada pengaturan Secret, bukan header bearer.
3. Filter: coalesce(after()._type, before()._type) in ["beritaAcara", "prestasi", "departemen", "bidang", "visiMisi", "kabinet", "faq", "homePage"].
4. Projection: {"_id": coalesce(after()._id, before()._id), "_type": coalesce(after()._type, before()._type)}. before() penting untuk penghapusan.
5. Periksa delivery log Sanity dan respons 200. Jangan menguji dengan menghapus konten asli. Tab pengunjung yang sudah terbuka masih menggunakan React Query staleTime satu jam; reload mengambil payload server terbaru.

Endpoint dan tes sudah tersedia, tetapi konfigurasi dashboard/secret production tidak dibuat otomatis. Tanpa secret, endpoint menolak request dengan 503. CORS yang sudah benar dipertahankan. Token Viewer non-expiring belum dirotasi: identifikasi pemakainya sebelum mengganti credential agar integrasi lama tidak terputus.

### Formulir kontak tetap nonaktif

Sesuai keputusan pengelola, CONTACT_ENABLED tidak diaktifkan. Endpoint menolak pengiriman sampai flag bernilai true, SMTP valid, dan CONTACT_REDIS_REST_URL/TOKEN lengkap. Tidak ada fallback penyimpanan memori. Redis REST menjalankan Lua atomik: 10 percobaan/IP/10 menit, receipt 24 jam. Pisahkan Redis produksi/preview atau gunakan namespace environment. Header IP hanya boleh berasal dari reverse proxy tepercaya (Vercel); hosting lain wajib menimpa X-Forwarded-For.

Receipt menyimpan hash payload/status, bukan isi email. Retry ID yang sama tidak mengirim ulang saat status pending/uncertain. SMTP tidak menjamin exactly-once delivery; pengiriman ambigu harus ditinjau, bukan diulang otomatis. Receipt kedaluwarsa setelah 24 jam. Uji Redis nyata dan SMTP staging sebelum aktivasi; tes saat ini memakai simulasi penyimpanan dan pengiriman. File diperiksa berdasarkan signature dan MIME; DOC lama tidak diterima, gunakan DOCX/PDF. Identifikasi format bukan antivirus.

Override dependency adm-zip menutup advisory ZIP, js-yaml khusus @vercel/frameworks menutup advisory versi 3 lama, dan uuid <11.1.1 diarahkan ke patch yang mendukung CommonJS. braces dan sprintf-js masih memiliki advisory tanpa rilis perbaikan saat audit; jangan menggunakan pola glob/format dari sumber tak tepercaya pada tooling. Jalankan npm audit kembali sebelum deployment. Jangan gunakan npm audit fix --force yang menawarkan downgrade Sanity/Next.
