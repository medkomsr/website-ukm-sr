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
