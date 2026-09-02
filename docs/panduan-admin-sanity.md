# Panduan Admin Sanity

**Website Seni Religi Universitas Brawijaya**  
Versi 1.0 — 1 September 2026

Panduan ini ditujukan untuk pengurus yang mengelola isi website melalui Sanity Studio. Anda tidak perlu memahami pemrograman, slug, CSS, GROQ, atau istilah teknis lain.

> Prinsip aman: simpan sebagai draft selama isi belum diperiksa. Tekan **Publish** hanya setelah judul, tanggal, gambar, dan teks alternatif sudah benar.

## Quick start: menerbitkan satu Kegiatan

1. Buka `/studio` pada alamat website, lalu masuk dengan akun yang telah diberi akses.
2. Pilih **Aktivitas & Prestasi → Kegiatan → Create**.
3. Isi **Judul**, **Deskripsi**, **Gambar utama**, **Teks alternatif gambar**, **Kategori**, **Tanggal mulai**, dan **Status**.
4. Untuk kegiatan beberapa hari, isi **Tanggal selesai**. Kosongkan untuk kegiatan satu hari.
5. Isi waktu dengan pola 24 jam, misalnya `09:30` atau `18:45`.
6. Periksa pesan merah di setiap bagian. Publish akan tertahan selama masih ada isian wajib atau format yang salah.
7. Periksa alamat halaman otomatis. Admin tidak perlu menulis atau mengubah alamat tersebut.
8. Tekan **Publish**, lalu buka halaman Aktivitas di website dan lakukan reload.

Target pengerjaan untuk Kegiatan sederhana adalah kurang dari 15 menit.

## Peta menu dan lokasi tampil konten

| Menu Studio | Isi yang dikelola | Lokasi utama di website |
|---|---|---|
| Panduan Admin | Tautan panduan ini | Hanya di Studio |
| Pengaturan & Halaman → Pengaturan Situs | Identitas, kontak, media sosial, statistik | Header, footer, kontak, dan bagian umum |
| Pengaturan & Halaman → Halaman Beranda | Teks pembuka dan Bidang unggulan | Beranda |
| Pengaturan & Halaman → Visi & Misi | Visi dan daftar misi | Halaman Tentang |
| Aktivitas & Prestasi → Kegiatan | Agenda, acara, atau pelaksanaan kegiatan | Daftar dan detail Aktivitas |
| Aktivitas & Prestasi → Artikel | Berita dan tulisan lengkap | Daftar dan detail Aktivitas |
| Aktivitas & Prestasi → Prestasi | Pencapaian organisasi atau anggota | Halaman Prestasi dan beranda |
| Organisasi → Bidang | Divisi seni resmi | Halaman Tentang dan pilihan Beranda |
| Organisasi → Departemen | Badan dan departemen kepengurusan | Halaman Tentang |
| Konten Pendukung → Galeri | Foto dokumentasi | Halaman Galeri |
| Konten Pendukung → FAQ | Tanya-jawab yang sering diajukan | Halaman Kontak |

Menu **Vision/GROQ** adalah alat developer dan hanya muncul pada lingkungan development. Admin produksi tidak perlu menggunakannya.

## Draft, publish, edit, dan unpublish

### Draft

- Perubahan disimpan otomatis sebagai draft.
- Draft belum terlihat oleh pengunjung.
- Gunakan draft ketika isi belum lengkap atau masih menunggu persetujuan.

### Publish

- Publish membuat versi terbaru tersedia bagi pengunjung.
- Setelah publish, lakukan reload halaman publik yang terkait.
- Alamat halaman Kegiatan, Artikel, Bidang, dan Departemen dibekukan setelah publish pertama agar tautan lama tidak rusak.

### Edit konten yang sudah terbit

1. Buka dokumen.
2. Ubah isinya.
3. Baca kembali seluruh bagian yang berubah.
4. Tekan **Publish** lagi.

Mengubah judul setelah publish tidak mengubah alamat halaman.

### Unpublish

Gunakan menu tindakan dokumen lalu pilih **Unpublish** jika isi harus segera disembunyikan tetapi mungkin dipakai kembali. Hindari **Delete** kecuali dokumen benar-benar salah dan sudah dipastikan tidak dirujuk oleh konten lain.

Pengaturan Situs, Halaman Beranda, dan Visi & Misi adalah dokumen tunggal. Dokumen ini tidak dapat diduplikasi atau dihapus melalui Studio.

## Aturan umum pengisian

### Judul dan nama

- Wajib diisi.
- Panjang 2–120 karakter.
- Gunakan kapitalisasi normal, bukan SEMUA HURUF BESAR.
- Hindari menambahkan tanggal ke judul jika tanggal sudah tersedia pada bagian Jadwal.

Benar: `Gebyar Seni Religi 2026`  
Kurang baik: `ACARA` atau judul lebih dari satu paragraf.

### Alamat halaman otomatis

Alamat dibuat dari judul atau singkatan. Jika alamat sudah dipakai, sistem menambahkan angka, misalnya `gebyar-seni-religi-2`. Admin cukup memastikan tampilan alamat masuk akal; jangan mencoba membuat istilah teknis sendiri.

### Tanggal

- Pilih melalui kalender.
- Sistem menyimpan tanggal secara konsisten sebagai `YYYY-MM-DD`.
- Contoh tanggal yang tersimpan: `2026-05-21`.
- Jangan menulis `21/5/26`, `21 Mei`, atau kalimat bebas pada kolom tanggal.
- Tanggal selesai tidak boleh lebih awal dari tanggal mulai.

Kegiatan rutin dibuat sebagai satu dokumen untuk setiap pelaksanaan. Contoh: latihan 7 September dan 14 September dibuat menjadi dua Kegiatan.

### Waktu

Gunakan format 24 jam `HH:mm`.

Benar: `08:00`, `13:30`, `19:45`  
Salah: `jam 8`, `8 malam`, `08.00`

### Gambar dan teks alternatif

Setiap gambar utama wajib memiliki teks alternatif sepanjang 5–160 karakter. Teks alternatif menjelaskan isi atau fungsi gambar bagi pengguna yang tidak dapat melihatnya.

Benar: `Penampilan tim hadrah pada pembukaan Dies Natalis UB`  
Salah: `gambar`, `foto1`, atau nama file seperti `IMG_8271.jpg`

Gunakan foto yang tajam, punya izin publikasi, dan tidak memuat data pribadi yang tidak perlu. Pilih satu gambar utama yang masih terbaca ketika dipotong menjadi kartu.

### Urutan, kapasitas, dan jumlah

- Urutan memakai bilangan bulat mulai dari `0`.
- Angka lebih kecil tampil lebih dahulu.
- Kapasitas dan jumlah harus bilangan bulat positif.
- Jangan memakai tanda titik, koma, atau kata pada kolom angka.

## Mengelola Kegiatan

### Informasi Utama

- **Judul**: nama kegiatan yang mudah dipahami.
- **Alamat halaman (otomatis)**: dibuat oleh sistem.
- **Deskripsi**: satu teks wajib sepanjang 20–3.000 karakter. Teks yang sama menjadi sumber kartu dan halaman detail; kartu otomatis memotong tampilan.
- **Kategori**: pilih kategori yang paling dekat dengan isi.
- **Status**: pilih status yang sesuai kondisi kegiatan.

Tidak ada lagi “Deskripsi singkat” dan “Deskripsi lengkap” terpisah, sehingga admin tidak perlu menjaga dua versi isi.

### Jadwal

- **Tanggal mulai** wajib.
- **Tanggal selesai** hanya untuk kegiatan beberapa hari.
- **Waktu** mengikuti `HH:mm`.
- Isi lokasi dan kapasitas bila relevan.

### Media dan Isi

- Tambahkan gambar utama dan teks alternatif.
- Agenda dapat berisi beberapa item; isi setiap item dengan lengkap.
- Tag bersifat opsional dan tidak boleh duplikat.

### Contoh Kegiatan yang baik

- Judul: `Latihan Gabungan Seni Religi`
- Deskripsi: `Latihan gabungan seluruh bidang untuk persiapan penampilan Dies Natalis Universitas Brawijaya.`
- Tanggal mulai: `2026-09-12`
- Waktu: `15:30`
- Teks alternatif: `Anggota Seni Religi berlatih bersama di aula kampus`

## Mengelola Artikel

Artikel sengaja memiliki dua bagian teks dengan fungsi berbeda:

- **Ringkasan**: 20–240 karakter untuk kartu, daftar, dan pengantar singkat.
- **Isi Artikel**: tulisan lengkap yang dibaca pada halaman detail.

Ringkasan bukan salinan paragraf panjang. Tulislah satu atau dua kalimat yang menjawab inti berita dan membuat pembaca memahami konteks.

Artikel juga memerlukan judul, alamat otomatis, gambar dan teks alternatif, kategori, tanggal, penulis, serta minimal satu blok Isi Artikel.

Contoh ringkasan yang baik: `Tim hadrah Seni Religi meraih juara pertama dalam Festival Seni Islami tingkat nasional di Malang.`

## Mengelola Bidang dan Departemen

### Bidang

**Bidang** adalah model resmi untuk divisi seni. Isi singkatan, nama lengkap, deskripsi, gambar, anggota, galeri bila ada, warna lapisan foto, dan urutan.

### Departemen

Program kerja diisi sebagai pasangan dalam satu item:

- Judul program
- Deskripsi program

Jangan membuat daftar judul dan daftar deskripsi secara terpisah. Tambah satu item baru untuk setiap program kerja.

### Warna lapisan foto

Admin memilih preset aman:

- **Hijau**: pilihan standar dan fallback.
- **Marun**: untuk aksen hangat atau identitas tertentu.
- **Netral**: untuk foto yang sudah memiliki warna kuat.

Tidak ada kolom CSS. Cara teknis membuat gradient sepenuhnya ditangani website.

## Mengelola Beranda

Pada Halaman Beranda, admin dapat memilih maksimal tiga **Bidang unggulan**. Bidang yang sama tidak dapat dipilih dua kali. Jika pilihan dikosongkan, website otomatis memakai tiga Bidang pertama berdasarkan urutan.

Gunakan judul dan teks pengantar yang ringkas. Hindari mengulang informasi yang sudah tampil pada kartu di bawahnya.

## Pesan validasi yang sering muncul

| Pesan atau kondisi | Penyebab | Cara memperbaiki |
|---|---|---|
| Field wajib masih kosong | Isian utama belum diisi | Buka bagian bertanda merah dan lengkapi |
| Tanggal selesai lebih awal | Rentang tanggal terbalik | Pilih tanggal selesai yang sama atau setelah tanggal mulai |
| Waktu harus `HH:mm` | Format waktu bebas | Ubah, misalnya dari `8 malam` menjadi `20:00` |
| Teks alternatif terlalu pendek | Deskripsi gambar kurang jelas | Jelaskan subjek dan kegiatan dalam 5–160 karakter |
| Ringkasan terlalu panjang | Ringkasan Artikel melewati 240 karakter | Pindahkan detail ke Isi Artikel |
| Alamat halaman sudah dipakai | Kegiatan/Artikel lain memakai alamat sama | Tunggu sistem memberi akhiran angka; jangan mengubah manual |
| Item belum lengkap | Salah satu bagian item array kosong | Lengkapi item atau hapus item kosong tersebut |

## Setelah publish tetapi perubahan belum terlihat

1. Pastikan tombol menunjukkan dokumen telah dipublish, bukan hanya tersimpan sebagai draft.
2. Reload halaman publik satu kali.
3. Pastikan membuka halaman yang benar sesuai peta menu.
4. Tunggu paling lama satu menit lalu fokuskan kembali tab browser.
5. Jika tetap belum berubah, catat judul dokumen, waktu publish, URL halaman, dan screenshot yang tidak memuat data pribadi. Kirim catatan tersebut kepada pengelola teknis.

Website menerima notifikasi publish/unpublish melalui webhook dan mengosongkan cache terkait. Hard refresh seharusnya menampilkan konten terbaru segera setelah webhook berhasil.

## Troubleshooting lain

### Tidak bisa masuk Studio

- Pastikan memakai akun yang telah diundang ke project Sanity.
- Coba mode incognito untuk memeriksa masalah sesi browser.
- Jangan membagikan kata sandi atau kode verifikasi kepada pengurus lain.
- Minta administrator Sanity memeriksa keanggotaan akun.

### Publish tertahan

Baca pesan merah dari atas ke bawah. Studio sengaja mencegah publish bila tanggal, waktu, jumlah, URL, email, gambar, atau item lain tidak valid.

### Konten muncul di tempat yang salah

Periksa tipe dokumen dan kategori. Kegiatan dan Artikel sama-sama muncul di Aktivitas, tetapi filter dan tampilan menggunakan tipe yang berbeda.

### Foto terlihat gelap atau sulit dibaca

Coba preset **Hijau**, **Marun**, atau **Netral** pada Warna lapisan foto. Jika tidak ada yang cocok, ganti foto yang memiliki ruang cukup untuk teks—jangan memasukkan kode CSS.

## Checklist sebelum publish

- [ ] Judul/nama jelas dan tidak salah eja.
- [ ] Tanggal dipilih melalui kalender dan rentang sudah benar.
- [ ] Waktu mengikuti format `HH:mm`.
- [ ] Deskripsi atau ringkasan menjelaskan konteks dengan lengkap.
- [ ] Gambar tajam, punya izin, dan tidak mengungkap data pribadi.
- [ ] Teks alternatif menjelaskan gambar.
- [ ] Kategori, status, dan lokasi sudah tepat.
- [ ] Tidak ada pesan validasi merah.
- [ ] Alamat halaman otomatis terlihat wajar.
- [ ] Isi sudah diperiksa minimal oleh satu pengurus lain untuk pengumuman penting.

## Checklist serah-terima periode

- [ ] Minimal dua admin baru telah diundang dengan akun masing-masing.
- [ ] Admin baru berhasil masuk tanpa memakai akun bersama.
- [ ] Setiap admin membuat satu draft Kegiatan latihan.
- [ ] Setiap admin dapat publish, edit, publish ulang, dan unpublish.
- [ ] Admin memahami perbedaan Kegiatan, Artikel, Prestasi, Bidang, dan Departemen.
- [ ] Admin mengetahui lokasi panduan Markdown dan PDF.
- [ ] Kontak pengelola teknis dan pemilik akun Sanity dicatat di dokumen internal organisasi.
- [ ] Rahasia webhook dan token API tidak dimasukkan ke chat, screenshot, atau panduan publik.
- [ ] Uji pembuatan satu Kegiatan diselesaikan maksimal 15 menit tanpa bantuan developer.

## Catatan untuk pengelola teknis

- PDF publik tersedia di `/panduan-admin-sanity.pdf` dan ditautkan dari menu Studio.
- Variabel server-only `SANITY_REVALIDATE_SECRET` wajib disetel pada deployment.
- Webhook Sanity mengarah ke `POST /api/revalidate/sanity` dan harus mengirim `_id`, `_type`, `projectId`, `dataset`, serta `operation`.
- Sebelum migrasi produksi, jalankan backup dan mode dry-run. Nilai tanggal ambigu tidak boleh ditebak.
- Setelah schema atau UI Studio berubah, perbarui dokumen sumber ini lalu ekspor ulang PDF.

---

Sumber utama panduan: `docs/panduan-admin-sanity.md`. Jika isi Markdown dan PDF berbeda, perbarui PDF dari sumber Markdown terbaru.
