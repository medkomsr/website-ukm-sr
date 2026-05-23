import { IMAGES } from "@/lib/types/data";

export interface BidangMember {
  name: string;
  role: string;
  fakultas: string;
  angkatan: string;
}

export interface BidangGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface BidangDetail {
  slug: string;
  heading: string;
  abbr: string;
  fullName: string;
  img: string;
  overlay: string;
  description: string;
  gallery: BidangGalleryItem[];
  ketuaBidang: BidangMember;
  wakilKetuaBidang: BidangMember;
}

// Overlay palette — alternating untuk konsistensi visual rhythm
const OVERLAY_MAROON = "linear-gradient(to bottom, rgba(66,10,10,0.15) 0%, rgba(66,10,10,0.92) 100%)";
const OVERLAY_GREEN = "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.92) 100%)";

export const BIDANG_DATA: Record<string, BidangDetail> = {
  "banjari-nasyid": {
    slug: "banjari-nasyid",
    heading: "Bidang",
    abbr: "Banjari & Nasyid",
    fullName: "Banjari & Nasyid",
    img: IMAGES.stage,
    overlay: OVERLAY_GREEN,
    description:
      "Bidang Banjari & Nasyid memadukan irama hadrah/banjari yang khas dengan harmoni vokal nasyid modern. Anggota dibina menjadi tim seni musik islami yang siap tampil di berbagai pentas seni, kompetisi nasional, hingga event keagamaan kampus dan luar kampus.",
    gallery: [
      { src: IMAGES.stage, alt: "Penampilan Banjari", caption: "Penampilan Banjari di Festival Seni Religi" },
      { src: IMAGES.community, alt: "Latihan Tim", caption: "Latihan Rutin Tim Banjari & Nasyid" },
      { src: IMAGES.festival, alt: "Festival Seni", caption: "Festival Tahunan UKM SR" },
      { src: IMAGES.sunset, alt: "Momen Kebersamaan", caption: "Kebersamaan Tim Pasca Tampil" },
    ],
    ketuaBidang: { name: "Reza Firmansyah", role: "Ketua Bidang Banjari & Nasyid", fakultas: "FIA", angkatan: "2022" },
    wakilKetuaBidang: { name: "Dinda Maharani", role: "Wakil Ketua Bidang", fakultas: "FISIP", angkatan: "2022" },
  },

  "khattil-quran": {
    slug: "khattil-quran",
    heading: "Bidang",
    abbr: "Khattil Qur'an",
    fullName: "Khattil Qur'an",
    img: IMAGES.calligraphy,
    overlay: OVERLAY_MAROON,
    description:
      "Bidang Khattil Qur'an menjadi wadah pengembangan seni menulis ayat-ayat Al-Qur'an dengan kaidah kaligrafi Arab yang baku. Anggota dilatih menguasai gaya Naskhi, Tsuluts, Diwani, Kufi, hingga Riq'ah, sekaligus dipersiapkan untuk MTQ tingkat universitas, regional, dan nasional.",
    gallery: [
      { src: IMAGES.calligraphy, alt: "Workshop Khat", caption: "Workshop Khat Tingkat Lanjut" },
      { src: IMAGES.art, alt: "Karya Khat", caption: "Pameran Karya Khattil Qur'an" },
      { src: IMAGES.geometric, alt: "Motif Geometris", caption: "Eksplorasi Motif Geometris Islami" },
      { src: IMAGES.ornament, alt: "Detail Ornamen", caption: "Detail Ornamen Arabesque" },
    ],
    ketuaBidang: { name: "Ahmad Fauzi", role: "Ketua Bidang Khattil Qur'an", fakultas: "FEB", angkatan: "2022" },
    wakilKetuaBidang: { name: "Zara Ningsih", role: "Wakil Ketua Bidang", fakultas: "FIA", angkatan: "2022" },
  },

  "hifdzil-quran": {
    slug: "hifdzil-quran",
    heading: "Bidang",
    abbr: "Hifdzil Qur'an",
    fullName: "Hifdzil Qur'an",
    img: IMAGES.mosque,
    overlay: OVERLAY_GREEN,
    description:
      "Bidang Hifdzil Qur'an membina anggota dalam menghafal Al-Qur'an secara sistematis melalui metode talaqqi dan muroja'ah berkala. Didampingi pembimbing yang berpengalaman, hafidz/hafidzah UKM dipersiapkan untuk berkompetisi di cabang 1, 5, 10, 20, hingga 30 juz.",
    gallery: [
      { src: IMAGES.mosque, alt: "Setoran Hafalan", caption: "Setoran Hafalan di Masjid Kampus" },
      { src: IMAGES.quran, alt: "Tadarus Al-Qur'an", caption: "Tadarus & Muroja'ah Bersama" },
      { src: IMAGES.courtyard, alt: "Halaman Masjid", caption: "Halaqoh Outdoor" },
      { src: IMAGES.community, alt: "Komunitas Hafidz", caption: "Komunitas Penghafal Al-Qur'an UKM SR" },
    ],
    ketuaBidang: { name: "Muhammad Hanif", role: "Ketua Bidang Hifdzil Qur'an", fakultas: "FIA", angkatan: "2022" },
    wakilKetuaBidang: { name: "Aisyah Salsabila", role: "Wakil Ketua Bidang", fakultas: "FK", angkatan: "2023" },
  },

  "syarhil-quran": {
    slug: "syarhil-quran",
    heading: "Bidang",
    abbr: "Syarhil Qur'an",
    fullName: "Syarhil Qur'an",
    img: IMAGES.community,
    overlay: OVERLAY_MAROON,
    description:
      "Bidang Syarhil Qur'an mengembangkan seni penyampaian tafsir Al-Qur'an secara komunikatif melalui kombinasi tilawah, sari tilawah (terjemah puitis), dan pidato. Tim Syarhil dibentuk dalam format trio dan rutin diturunkan dalam ajang MTQ Mahasiswa Nasional.",
    gallery: [
      { src: IMAGES.community, alt: "Penampilan Syarhil", caption: "Penampilan Tim Syarhil di MTQ" },
      { src: IMAGES.stage, alt: "Latihan Pidato", caption: "Latihan Pidato & Sari Tilawah" },
      { src: IMAGES.mosque, alt: "Pembinaan", caption: "Pembinaan oleh Ustadz Pembimbing" },
      { src: IMAGES.golden, alt: "Penghargaan", caption: "Penghargaan Tim Syarhil" },
    ],
    ketuaBidang: { name: "Faiz Abdurrahman", role: "Ketua Bidang Syarhil Qur'an", fakultas: "FH", angkatan: "2022" },
    wakilKetuaBidang: { name: "Khansa Nabilah", role: "Wakil Ketua Bidang", fakultas: "FISIP", angkatan: "2023" },
  },

  "fahmil-quran": {
    slug: "fahmil-quran",
    heading: "Bidang",
    abbr: "Fahmil Qur'an",
    fullName: "Fahmil Qur'an",
    img: IMAGES.courtyard,
    overlay: OVERLAY_GREEN,
    description:
      "Bidang Fahmil Qur'an merupakan cabang kompetisi cerdas-cermat berbasis pemahaman isi Al-Qur'an, terjemah, tafsir, ilmu tajwid, dan ulumul Qur'an. Anggota ditempa untuk berpikir cepat, akurat, dan mendalam menghadapi soal-soal MTQ tingkat nasional.",
    gallery: [
      { src: IMAGES.courtyard, alt: "Sesi Latihan", caption: "Sesi Latihan Soal Fahmil" },
      { src: IMAGES.community, alt: "Diskusi Tafsir", caption: "Diskusi Tafsir & Ulumul Qur'an" },
      { src: IMAGES.quran, alt: "Kajian Bersama", caption: "Kajian Bersama Pembimbing" },
      { src: IMAGES.golden, alt: "Prestasi Tim", caption: "Prestasi Tim Fahmil Qur'an" },
    ],
    ketuaBidang: { name: "Rifqi Aziz", role: "Ketua Bidang Fahmil Qur'an", fakultas: "FILKOM", angkatan: "2022" },
    wakilKetuaBidang: { name: "Salma Faradila", role: "Wakil Ketua Bidang", fakultas: "FEB", angkatan: "2023" },
  },

  dia: {
    slug: "dia",
    heading: "Bidang",
    abbr: "DIA",
    fullName: "Debat Ilmiah Al-Qur'an",
    img: IMAGES.golden,
    overlay: OVERLAY_MAROON,
    description:
      "Bidang Debat Ilmiah Al-Qur'an (DIA) mengasah kemampuan berargumen ilmiah berbasis kajian Al-Qur'an dalam Bahasa Indonesia, Inggris, maupun Arab. DIA membentuk pemikir kritis yang mampu mengintegrasikan wahyu, sains, dan isu kontemporer secara akademis.",
    gallery: [
      { src: IMAGES.golden, alt: "Lomba Debat", caption: "Penampilan Tim DIA" },
      { src: IMAGES.writing, alt: "Riset Kasus", caption: "Riset & Penyusunan Argumen" },
      { src: IMAGES.community, alt: "Sparring Tim", caption: "Sparring Antar Tim DIA" },
      { src: IMAGES.festival, alt: "Final MTQ", caption: "Final Cabang DIA" },
    ],
    ketuaBidang: { name: "Daffa Pratama", role: "Ketua Bidang DIA", fakultas: "FH", angkatan: "2022" },
    wakilKetuaBidang: { name: "Najwa Syafira", role: "Wakil Ketua Bidang", fakultas: "FISIP", angkatan: "2023" },
  },

  ktdaq: {
    slug: "ktdaq",
    heading: "Bidang",
    abbr: "KTDAQ",
    fullName: "Karya Tulis & Desain Aplikasi Qur'ani",
    img: IMAGES.writing,
    overlay: OVERLAY_GREEN,
    description:
      "Bidang KTDAQ adalah ruang inovasi UKM untuk melahirkan karya tulis ilmiah dan desain aplikasi/produk digital bertemakan Al-Qur'an. Bidang ini menggabungkan riset akademik, ide kreatif, dan pengembangan teknologi sebagai bekal anggota berkompetisi di MTQ MN.",
    gallery: [
      { src: IMAGES.writing, alt: "Workshop KTI", caption: "Workshop Karya Tulis Ilmiah" },
      { src: IMAGES.art, alt: "Mockup Aplikasi", caption: "Pengembangan Aplikasi Qur'ani" },
      { src: IMAGES.geometric, alt: "Desain Visual", caption: "Eksplorasi Desain Visual" },
      { src: IMAGES.community, alt: "Tim KTDAQ", caption: "Sesi Brainstorming Tim" },
    ],
    ketuaBidang: { name: "Bagas Setiawan", role: "Ketua Bidang KTDAQ", fakultas: "FILKOM", angkatan: "2022" },
    wakilKetuaBidang: { name: "Hesti Wulandari", role: "Wakil Ketua Bidang", fakultas: "FEB", angkatan: "2022" },
  },

  ttq: {
    slug: "ttq",
    heading: "Bidang",
    abbr: "TTQ",
    fullName: "Tilawah & Tartil Qur'an",
    img: IMAGES.quran,
    overlay: OVERLAY_MAROON,
    description:
      "Bidang Tilawah & Tartil Qur'an (TTQ) membina qari/qariah dalam membaca Al-Qur'an dengan irama (lagu) dan kaidah tajwid yang sempurna. Cabang Tartil menekankan kefasihan tanpa lagu, sementara Tilawah mengeksplorasi maqamat seperti Bayati, Hijaz, Nahawand, hingga Sika.",
    gallery: [
      { src: IMAGES.quran, alt: "Latihan Tilawah", caption: "Latihan Tilawah Mingguan" },
      { src: IMAGES.mosque, alt: "Tilawah Masjid", caption: "Tilawah di Masjid Kampus" },
      { src: IMAGES.courtyard, alt: "Pembinaan Qari", caption: "Pembinaan Qari oleh Ustadz" },
      { src: IMAGES.community, alt: "Komunitas TTQ", caption: "Komunitas Qari/Qariah UKM SR" },
    ],
    ketuaBidang: { name: "Nurul Hidayah", role: "Ketua Bidang TTQ", fakultas: "FIA", angkatan: "2022" },
    wakilKetuaBidang: { name: "Omar Abdullah", role: "Wakil Ketua Bidang", fakultas: "FIA", angkatan: "2023" },
  },
};
