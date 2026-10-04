"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/site-layout";
import { useBidangBySlug } from "@/hooks/useBidang";
import { srFields } from "@/lib/sr-fields";
import HeroSection from "./hero";
import DeskripsiSection from "./deskripsi";
import GaleriSection from "./galeri";
import StrukturSection from "./struktur";
import BackSection from "./back";

const learning = [
  "Mendalami kandungan ayat, tafsir, tajwid, dan pengetahuan keislaman. Cerdas cermat mengajak kita menghubungkan pemahaman dengan ketepatan menjawab serta kerja sama tim.",
  "Mempelajari cara merangkai pesan, menyusun naskah, dan menyampaikan makna ayat kepada pendengar. Tilawah, terjemah puitis, dan pidato saling melengkapi dalam satu penampilan.",
  "Mengenal proses menghafal yang bertahap, memperbaiki bacaan, dan menjaga hafalan melalui pengulangan. Ketekunan dan konsistensi menjadi bagian penting dari perjalanan ini.",
  "Mengembangkan bacaan yang jelas dan tertib sesuai kaidah tajwid. Eksplorasi irama tilawah berjalan bersama perhatian pada makhraj, panjang pendek, dan makna bacaan.",
  "Mengembangkan pertanyaan riset, menyusun tulisan, dan merancang solusi digital yang berangkat dari nilai Qur’ani. Gagasan diuji melalui penalaran, penulisan, dan perancangan yang terstruktur.",
  "Mengeksplorasi pola pukulan banjari, teknik vokal, dan harmonisasi. Kepekaan mendengar serta kerja sama menjadi dasar untuk menyatukan setiap suara dalam satu penampilan.",
  "Mengenal proporsi huruf, komposisi, dan kaidah penulisan kaligrafi. Setiap goresan menjadi kesempatan untuk melatih ketelitian sekaligus mengembangkan rasa artistik.",
  "Belajar menyusun argumen, menelaah sumber, dan menanggapi sudut pandang lain secara runtut. Diskusi menghubungkan kajian Al-Qur’an dengan ilmu pengetahuan dan isu kontemporer.",
];

/** Published CMS profiles take precedence; the eight core disciplines stay discoverable before publication. */
export default function BidangContent({ slug }: { slug: string }) {
  const { data, isLoading } = useBidangBySlug(slug);
  const index = srFields.findIndex((field) => field.slug === slug);
  if (isLoading)
    return (
      <SiteLayout>
        <section
          className="min-h-[60vh] grid place-items-center"
          aria-busy="true"
        >
          Memuat bidang…
        </section>
      </SiteLayout>
    );
  if (data)
    return (
      <SiteLayout>
        <HeroSection slug={slug} />
        <DeskripsiSection slug={slug} />
        <GaleriSection slug={slug} />
        <StrukturSection slug={slug} />
        <BackSection />
      </SiteLayout>
    );
  if (index < 0) return notFound();
  const field = srFields[index];
  return (
    <SiteLayout>
      <section
        className="px-6 py-20 md:py-28"
        style={{ background: "var(--sr-bg)", color: "var(--sr-ink)" }}
      >
        <div className="max-w-4xl mx-auto">
          <Link href="/#crafts" className="text-sm">
            ← Kembali ke delapan bidang
          </Link>
          <p className="mt-14 text-xs tracking-widest uppercase">
            Seni Religi / Bidang 0{index + 1}
          </p>
          <h1 className="mt-5 text-5xl md:text-7xl tracking-tight font-medium">
            {field.name}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed">{field.text}</p>
          <div className="mt-14 border-t border-(--sr-line) pt-10 grid md:grid-cols-[1fr_2fr] gap-6">
            <h2 className="text-2xl tracking-tight">Ruang belajar</h2>
            <p className="text-base leading-loose">{learning[index]}</p>
          </div>
          <div
            className="mt-14 rounded-2xl p-8"
            style={{ background: "var(--sr-surface)" }}
          >
            <h2 className="text-2xl">Ingin mengenal {field.name}?</h2>
            <p className="mt-4 text-sm leading-relaxed">
              Hubungi keluarga SR untuk informasi kegiatan, latihan, dan cara
              bergabung.
            </p>
            <Link
              href="/kontak"
              className="inline-block mt-6 rounded-full bg-(--sr-yellow) px-6 py-3 text-sm text-[#173b28]"
            >
              Hubungi kami ↗
            </Link>
          </div>
          {slug === "khattil-quran" && (
            <Link href="/katalog" className="inline-block mt-8 underline">
              Jelajahi katalog kaligrafi ↗
            </Link>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
