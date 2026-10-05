import SiteLayout from "@/components/layout/site-layout";
import type { SanityPrestasi } from "@/sanity/types";
import AchievementExperience from "@/features/achievements/components/achievement-experience";

export const metadata = {
  title: "Contoh Arsip Prestasi | Seni Religi UB",
  robots: { index: false, follow: false },
};

// Fictional preview data; never stored in the achievement collection.
const previewAchievements: SanityPrestasi[] = [
  {
    _id: "demo-prestasi-tilawah",
    title: "Musabaqah Tilawatil Qur’an Mahasiswa",
    description: [
      "DATA CONTOH — pencapaian dan peserta pada pratinjau ini bersifat fiktif. Deskripsi ini dibuat lebih panjang untuk memperlihatkan area detail yang dapat discroll.",
      "Contoh kisah perjalanan perwakilan bidang Tilawah & Tartil: dari latihan rutin, pendampingan bersama pembina, hingga tampil di panggung kompetisi. Ruang ini nantinya memuat cerita pencapaian yang sebenarnya, dokumentasi kegiatan, dan proses di balik kemenangan.",
      "PERSIAPAN\nBagian ini bisa menceritakan bagaimana peserta menyiapkan diri, menyusun jadwal latihan, dan memperbaiki penampilan berdasarkan masukan pembina. Cerita tidak hanya memuat hasil akhir, tetapi juga usaha yang dilakukan bersama selama proses persiapan.",
      "HARI PERLOMBAAN\nTuliskan suasana kegiatan, tahapan seleksi, dan pengalaman peserta ketika tampil. Informasi mengenai cabang lomba, penyelenggara, serta lokasi dapat membantu pembaca memahami konteks pencapaian. Foto di sebelahnya dapat diisi dokumentasi saat menerima penghargaan atau memegang piala bersama tim.",
      "DI BALIK PENCAPAIAN\nRuang ini juga dapat digunakan untuk memberikan apresiasi kepada pembina, rekan latihan, dan pihak yang mendukung perjalanan peserta. Kutipan atau refleksi peserta bisa melengkapi cerita agar pengalaman tersebut menjadi inspirasi bagi anggota berikutnya.",
      "LANGKAH BERIKUTNYA\nTutup cerita dengan pelajaran yang diperoleh dan harapan untuk kegiatan selanjutnya. Semua paragraf contoh ini nantinya diganti dengan kisah dan dokumentasi prestasi yang sebenarnya.",
    ].join("\n\n"),
    year: 2026,
    category: "Kompetisi",
    field: "Tilawah & Tartil",
    level: "Nasional",
    position: "Juara 1",
    organizer: "Panitia MTQ Mahasiswa (contoh)",
    location: "Malang, Jawa Timur (contoh)",
    participants: [
      {
        _key: "peserta-contoh",
        name: "Peserta Contoh",
        faculty: "Fakultas Ilmu Budaya (contoh)",
      },
    ],
  },
];

export default function PrestasiPreviewPage() {
  return (
    <SiteLayout footerWave={false}>
      <AchievementExperience previewData={previewAchievements} />
    </SiteLayout>
  );
}
