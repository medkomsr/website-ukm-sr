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
