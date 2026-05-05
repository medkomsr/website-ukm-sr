import { IMAGES } from "@/lib/data";

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

export const BIDANG_DATA: Record<string, BidangDetail> = {
  kaligrafi: {
    slug: "kaligrafi",
    heading: "Bidang",
    abbr: "Kaligrafi",
    fullName: "Kaligrafi Islami",
    img: IMAGES.calligraphy,
    overlay: "linear-gradient(to bottom, rgba(66,10,10,0.15) 0%, rgba(66,10,10,0.92) 100%)",
    description:
      "Bidang Kaligrafi Islami menjadi wadah pengembangan seni tulis Arab yang indah dan penuh makna. Melalui latihan intensif dan bimbingan ustadz berpengalaman, anggota ditempa menjadi kaligrafer yang mampu menghadirkan keindahan firman Allah dalam bentuk visual yang memukau dan bermartabat.",
    gallery: [
      { src: IMAGES.calligraphy, alt: "Workshop Kaligrafi", caption: "Workshop Kaligrafi Tingkat Lanjut" },
      { src: IMAGES.art, alt: "Karya Kaligrafi", caption: "Pameran Karya Kaligrafi" },
      { src: IMAGES.geometric, alt: "Motif Islami", caption: "Eksplorasi Motif Geometris Islami" },
      { src: IMAGES.ornament, alt: "Detail Ornamen", caption: "Detail Ornamen Arabesque" },
    ],
    ketuaBidang: { name: "Ahmad Fauzi", role: "Ketua Bidang Kaligrafi", fakultas: "FEB", angkatan: "2022" },
    wakilKetuaBidang: { name: "Zara Ningsih", role: "Wakil Ketua Bidang", fakultas: "FIA", angkatan: "2022" },
  },
  nasyid: {
    slug: "nasyid",
    heading: "Bidang",
    abbr: "Nasyid",
    fullName: "Nasyid",
    img: IMAGES.stage,
    overlay: "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.92) 100%)",
    description:
      "Bidang Nasyid merupakan jantung dari ekspresi seni religi UKM dalam bentuk musik vokal. Menggabungkan harmoni suara yang indah dengan pesan-pesan Islami yang mendalam, bidang ini menjadi duta UKM di berbagai kompetisi nasional dan pentas seni bergengsi di seluruh Indonesia.",
    gallery: [
      { src: IMAGES.stage, alt: "Penampilan Nasyid", caption: "Penampilan Nasyid Festival 2026" },
      { src: IMAGES.community, alt: "Latihan Bersama", caption: "Latihan Rutin Nasyid" },
      { src: IMAGES.festival, alt: "Festival Seni Religi", caption: "Festival Seni Religi Tahunan" },
      { src: IMAGES.sunset, alt: "Momen Kebersamaan", caption: "Momen Kebersamaan Tim Nasyid" },
    ],
    ketuaBidang: { name: "Reza Firmansyah", role: "Ketua Bidang Nasyid", fakultas: "FIA", angkatan: "2022" },
    wakilKetuaBidang: { name: "Dinda Maharani", role: "Wakil Ketua Bidang", fakultas: "FISIP", angkatan: "2022" },
  },
  tilawah: {
    slug: "tilawah",
    heading: "Bidang",
    abbr: "Tilawah",
    fullName: "Tilawah Al-Quran",
    img: IMAGES.quran,
    overlay: "linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.92) 100%)",
    description:
      "Bidang Tilawah Al-Quran berkomitmen untuk membina qari dan qariah yang tidak hanya fasih dalam membaca Al-Quran, tetapi juga mampu menghadirkan keindahan maqam yang menyentuh kalbu. Program ini menggabungkan metode talaqqi klasik dengan teknologi digital modern.",
    gallery: [
      { src: IMAGES.quran, alt: "Tilawah Al-Quran", caption: "Latihan Tilawah Mingguan" },
      { src: IMAGES.mosque, alt: "Masjid Kampus", caption: "Tilawah di Masjid Kampus" },
      { src: IMAGES.courtyard, alt: "Halaman Masjid", caption: "Kegiatan Tilawah Outdoor" },
      { src: IMAGES.community, alt: "Komunitas Tilawah", caption: "Komunitas Tilawah UKM SR" },
    ],
    ketuaBidang: { name: "Nurul Hidayah", role: "Ketua Bidang Tilawah", fakultas: "FIA", angkatan: "2022" },
    wakilKetuaBidang: { name: "Omar Abdullah", role: "Wakil Ketua Bidang", fakultas: "FIA", angkatan: "2023" },
  },
  sastra: {
    slug: "sastra",
    heading: "Bidang",
    abbr: "Sastra",
    fullName: "Sastra Religi",
    img: IMAGES.writing,
    overlay: "linear-gradient(to bottom, rgba(66,10,10,0.15) 0%, rgba(66,10,10,0.92) 100%)",
    description:
      "Bidang Sastra Religi menjadi ruang ekspresi jiwa melalui kata-kata yang sarat makna spiritual. Puisi, prosa, dan esai religi menjadi medium anggota untuk menyampaikan keindahan Islam dalam bahasa yang menyentuh hati dan menginspirasi banyak jiwa.",
    gallery: [
      { src: IMAGES.writing, alt: "Workshop Puisi", caption: "Workshop Puisi & Storytelling Religi" },
      { src: IMAGES.ornament, alt: "Karya Sastra", caption: "Pameran Karya Sastra" },
      { src: IMAGES.golden, alt: "Penghargaan Sastra", caption: "Penghargaan Sastra Religi Nasional" },
      { src: IMAGES.calligraphy, alt: "Kolaborasi Kaligrafi", caption: "Kolaborasi Kaligrafi & Puisi" },
    ],
    ketuaBidang: { name: "Hesti Wulandari", role: "Ketua Bidang Sastra", fakultas: "FEB", angkatan: "2022" },
    wakilKetuaBidang: { name: "Jihan Fadhilah", role: "Wakil Ketua Bidang", fakultas: "FISIP", angkatan: "2023" },
  },
};
