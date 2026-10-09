import { existsSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { srFields } from "../lib/constants/art-fields";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const departments = [
  {
    slug: "bkrt",
    abbr: "BKRT",
    fullName: "Badan Kerumahtanggaan",
    description:
      "Merawat ruang bersama dan memastikan perlengkapan organisasi siap digunakan. BKRT mengelola inventaris, kebersihan sekretariat, serta dukungan sarana untuk latihan dan kegiatan anggota.",
    programs: [
      [
        "Inventaris Terpadu",
        "Mencatat kondisi dan peminjaman perlengkapan secara berkala agar kebutuhan setiap bidang dapat dipenuhi dengan tertib.",
      ],
      [
        "Sekretariat Nyaman",
        "Kerja bakti bulanan dan penataan ruang belajar untuk menciptakan tempat berkumpul yang nyaman bagi anggota.",
      ],
      [
        "Dukungan Sarana Kegiatan",
        "Menyiapkan perlengkapan panggung, ruang latihan, dan kebutuhan teknis bersama panitia kegiatan.",
      ],
    ],
  },
  {
    slug: "minba",
    abbr: "Minba",
    fullName: "Departemen Minat dan Bakat",
    description:
      "Mendampingi anggota menemukan potensi dan mengembangkan keterampilan seni religi. Minba menyelaraskan pembinaan lintas bidang, membuka ruang apresiasi, dan mendukung persiapan delegasi kompetisi.",
    programs: [
      [
        "Peta Potensi Anggota",
        "Mengenali minat dan pengalaman anggota melalui diskusi singkat serta sesi mencoba berbagai bidang.",
      ],
      [
        "Panggung Apresiasi",
        "Pertunjukan kecil sebagai ruang mencoba karya, menerima masukan, dan menumbuhkan keberanian tampil.",
      ],
      [
        "Kelas Persiapan Delegasi",
        "Pendampingan terjadwal untuk mengembangkan materi, kesiapan tampil, dan kerja sama tim sebelum kompetisi.",
      ],
    ],
  },
  {
    slug: "psdm",
    abbr: "PSDM",
    fullName: "Departemen Pengembangan Sumber Daya Manusia",
    description:
      "Membangun perjalanan belajar anggota yang terbuka, terarah, dan saling mendukung. PSDM mendampingi proses pengenalan organisasi, pengembangan kepemimpinan, dan evaluasi pengalaman berorganisasi.",
    programs: [
      [
        "Temu Anggota Baru",
        "Pengenalan nilai organisasi dan kegiatan lintas kelompok untuk membangun rasa memiliki sejak awal.",
      ],
      [
        "Kelas Kepemimpinan",
        "Latihan komunikasi, pengelolaan waktu, dan penyelesaian masalah melalui studi kasus kegiatan mahasiswa.",
      ],
      [
        "Ruang Refleksi",
        "Forum berbagi pengalaman dan umpan balik agar proses pembinaan terus berkembang mengikuti kebutuhan anggota.",
      ],
    ],
  },
  {
    slug: "medkom",
    abbr: "Medkom",
    fullName: "Departemen Media dan Komunikasi",
    description:
      "Menghubungkan cerita, karya, dan kegiatan Seni Religi dengan publik. Medkom mengelola dokumentasi, desain publikasi, penulisan berita, serta komunikasi digital organisasi.",
    programs: [
      [
        "Kabar Seni Religi",
        "Publikasi rutin yang merangkum kegiatan, cerita anggota, dan agenda organisasi dalam format yang mudah dibaca.",
      ],
      [
        "Studio Kreatif",
        "Lokakarya fotografi, desain, dan penyuntingan video untuk mengembangkan keterampilan tim dokumentasi.",
      ],
      [
        "Arsip Cerita",
        "Pengelompokan foto dan catatan kegiatan agar dokumentasi mudah ditemukan dan diteruskan kepada pengurus berikutnya.",
      ],
    ],
  },
];

async function main() {
  const client = getCliClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "raw",
  });
  const existing = await client.fetch<
    Array<{ _id: string; _rev: string; _type: string; visi?: string }>
  >('*[_type in ["visiMisi", "departemen", "bidang"]]');
  if (process.argv.includes("--inspect")) {
    console.log(
      JSON.stringify(
        existing.filter((d) => d._id.startsWith("drafts.")),
        null,
        2,
      ),
    );
    return;
  }
  const assets = await client.fetch<Array<{ _id: string }>>(
    '*[_type == "sanity.imageAsset" && originalFilename match "sr-demo-2026-*"] | order(originalFilename asc){_id}',
  );
  if (assets.length !== 5) throw new Error("Lima foto demo dari seed awal harus tersedia.");
  const photo = (i: number) => ({
    _type: "image",
    asset: { _type: "reference", _ref: assets[i % 5]._id },
  });
  const documents: Array<{ _id: string; _type: string; [key: string]: unknown }> = [
    ...departments.map((dept, i) => ({
      _id: `departemen-${dept.slug}`,
      _type: "departemen",
      abbr: dept.abbr,
      slug: { _type: "slug", current: dept.slug },
      fullName: dept.fullName,
      image: photo(i),
      programKerja: dept.programs.map(([nama, detail], j) => ({
        _type: "programKerja",
        _key: `program-${j}`,
        nama,
        detail,
        foto: photo(i + j),
      })),
      pengurus: ["Koordinator", "Sekretaris", "Staf Program", "Staf Dokumentasi"].map(
        (jabatan, j) => ({
          _type: "pengurus",
          _key: `member-${j}`,
          nama: `${["Nadia Putri", "Raka Pratama", "Alya Safira", "Fajar Ramadhan"][(i + j) % 4]} (Demo)`,
          jabatan,
          foto: photo(i + j),
        }),
      ),
    })),
    ...srFields.map((field, i) => ({
      _id: `bidang-${field.slug}`,
      _type: "bidang",
      abbr: field.name,
      slug: { _type: "slug", current: field.slug },
      fullName: `Bidang ${field.name}`,
      description: field.description,
      image: photo(i + 2),
      ketuaBidang: {
        _type: "object",
        name: `${["Farhan Hakim", "Naila Zahra", "Rizky Ananda", "Salma Azzahra"][i % 4]} (Demo)`,
        role: "Ketua Bidang",
        image: photo(i + 1),
      },
      wakilKetuaBidang: {
        _type: "object",
        name: `${["Dinda Kirana", "Arif Maulana", "Hana Salsabila", "Ilham Fadhil"][i % 4]} (Demo)`,
        role: "Wakil Ketua Bidang",
        image: photo(i + 2),
      },
      gallery: [
        "Latihan rutin",
        "Diskusi materi",
        "Persiapan penampilan",
        "Evaluasi bersama",
        "Kebersamaan anggota",
      ].map((caption, j) => ({
        _type: "object",
        _key: `gallery-${j}`,
        image: photo(i + j),
        caption: `${caption} ${field.name} — ilustrasi demo`,
        alt: `Cuplikan company profile untuk ilustrasi ${caption.toLowerCase()} ${field.name}`,
      })),
    })),
  ];
  const vision = {
    visi: "Menjadi ruang tumbuh bagi mahasiswa untuk mengembangkan seni religi yang kreatif, berprestasi, dan berlandaskan nilai-nilai Al-Qur’an.",
    misi: [
      "Menyelenggarakan pembinaan seni religi yang terarah, inklusif, dan berkelanjutan bagi seluruh anggota.",
      "Membangun lingkungan organisasi yang hangat, kolaboratif, dan menghargai proses belajar setiap individu.",
      "Mendorong lahirnya karya serta prestasi melalui latihan, pendampingan, dan ruang apresiasi.",
      "Menghadirkan kegiatan yang bermanfaat bagi kampus dan masyarakat melalui kolaborasi serta pengabdian.",
      "Menjaga kesinambungan organisasi melalui dokumentasi, evaluasi, dan kaderisasi yang bertanggung jawab.",
    ],
  };
  const oldDemoIds = ["demo-sr-2026-bidang-ktdaq", "demo-sr-2026-departemen-bkrt"].filter((id) =>
    existing.some((d) => d._id === id),
  );
  const targetDrafts = existing.filter((d) =>
    documents.some((doc) => `drafts.${doc._id}` === d._id),
  );
  for (const draft of targetDrafts) {
    const content = draft as Record<string, unknown>;
    const programs = content.programKerja as Array<Record<string, unknown>> | undefined;
    if (
      content.description ||
      content.image ||
      content.fullName ||
      content.pengurus ||
      content.gallery ||
      programs?.some((p) => p.nama || p.detail || p.foto)
    ) {
      throw new Error(`Draft ${draft._id} berisi suntingan. Tinjau sebelum mengisi dummy.`);
    }
  }
  console.log(
    JSON.stringify(
      {
        project: client.config().projectId,
        dataset: client.config().dataset,
        documents: documents.map((d) => d._id),
        vision,
        migrateDemoIds: oldDemoIds,
      },
      null,
      2,
    ),
  );
  if (!process.argv.includes("--apply")) return;
  const backup = process.argv[process.argv.indexOf("--backup") + 1];
  if (!process.argv.includes("--backup") || !backup)
    throw new Error("Wajib menyediakan --backup <file.json>.");
  writeFileSync(backup, JSON.stringify(existing, null, 2), { flag: "wx" });
  if (oldDemoIds.length && (await client.fetch("count(*[references($ids)])", { ids: oldDemoIds })))
    throw new Error("Dokumen demo lama masih direferensikan; migrasi dibatalkan.");
  const currentVision = existing.find((d) => d._id === "visiMisi");
  const replaceVision = !currentVision || /^as[adskj\s]*$/i.test(currentVision.visi ?? "");
  let tx = client.transaction();
  for (const doc of documents) tx = tx.createIfNotExists(doc);
  if (!currentVision) tx = tx.createIfNotExists({ _id: "visiMisi", _type: "visiMisi", ...vision });
  else if (replaceVision)
    tx = tx.patch("visiMisi", (p) => p.ifRevisionId(currentVision._rev).set(vision));
  for (const id of oldDemoIds) tx = tx.delete(id);
  for (const draft of targetDrafts) tx = tx.delete(draft._id);
  await tx.commit({ visibility: "sync" });
  console.log(
    JSON.stringify(
      await client.fetch(
        '*[_id in $ids]{_id, "photo": defined(image.asset->url), "gallery": count(gallery), "programs": count(programKerja)}',
        { ids: documents.map((d) => d._id) },
      ),
      null,
      2,
    ),
  );
  console.log(`Visi-misi ${replaceVision ? "diisi" : "dipertahankan"}. Backup: ${backup}`);
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
