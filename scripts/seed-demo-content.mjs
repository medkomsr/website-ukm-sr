import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

// Dry run by default. Use Sanity's authenticated CLI, never a browser token.
// node node_modules/@sanity/cli/bin/run.js exec scripts/seed-demo-content.mjs --with-user-token -- --apply --images-dir <folder>
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const prefix = "demo-sr-2026-";
const notice = "Data demo untuk pratinjau tampilan; bukan catatan kegiatan atau prestasi resmi.";
const photoNotice = "Cuplikan video company profile SR 2025 sebagai ilustrasi demo.";
const stories = [
  [
    "berita",
    "Ruang Pertama untuk Bertumbuh Bersama",
    "Berita",
    "2026-10-07",
    "Perkenalan anggota menjadi awal untuk saling mengenal, berbagi minat, dan menemukan ruang berkarya di Seni Religi.",
  ],
  [
    "berita",
    "Dari Goresan Awal Menuju Karya Kaligrafi",
    "Liputan",
    "2026-09-24",
    "Latihan kaligrafi mengajak anggota mempelajari proporsi huruf, menyusun komposisi, dan bertukar masukan atas karya masing-masing.",
  ],
  [
    "berita",
    "Merawat Kekompakan melalui Latihan Banjari",
    "Liputan",
    "2026-09-15",
    "Pertemuan rutin menjadi ruang untuk menyelaraskan pola pukulan, melatih harmoni vokal, dan membangun kepekaan dalam bermain bersama.",
  ],
  [
    "berita",
    "Persiapan Delegasi Menuju Panggung Kompetisi",
    "Prestasi",
    "2026-08-28",
    "Simulasi penampilan membantu anggota mengevaluasi kesiapan materi, penguasaan panggung, dan kerja sama sebelum mengikuti kompetisi.",
  ],
  [
    "berita",
    "Pendaftaran Kelas Pengembangan Anggota",
    "Pengumuman",
    "2026-08-10",
    "Rangkaian kelas pengembangan membuka kesempatan untuk mencoba bidang baru, memperluas pengalaman, dan menyusun target belajar bersama.",
  ],
  [
    "acara",
    "Festival Seni dan Kreasi Qurani",
    "Festival",
    "2026-11-21",
    "Pertunjukan lintas bidang mempertemukan tilawah, syarhil, kaligrafi, dan musik religi dalam satu ruang apresiasi.",
  ],
  [
    "acara",
    "Workshop Kaligrafi: Huruf, Warna, dan Cerita",
    "Workshop",
    "2026-10-24",
    "Peserta mengeksplorasi dasar penulisan huruf dan komposisi warna melalui praktik singkat serta diskusi karya.",
  ],
  [
    "acara",
    "Malam Apresiasi Karya Anggota",
    "Festival",
    "2026-10-08",
    "Sesi berbagi karya memberikan kesempatan bagi anggota untuk tampil, bercerita tentang proses kreatif, dan saling memberi apresiasi.",
  ],
  [
    "acara",
    "Simulasi Musabaqah Antarbidang",
    "Lomba",
    "2026-09-20",
    "Latihan dalam format kompetisi mempertemukan beberapa bidang untuk menguji kesiapan, ketelitian, dan kemampuan tampil.",
  ],
  [
    "acara",
    "Lingkar Belajar dan Murojaah Bersama",
    "Rutin",
    "2026-09-06",
    "Pertemuan santai untuk menjaga hafalan, menyimak bacaan, dan membangun kebiasaan belajar yang konsisten.",
  ],
];
const achievements = [
  [
    2026,
    "Musabaqah Tilawatil Quran Mahasiswa",
    "Nasional",
    "Juara 1",
    "Kompetisi",
    "Tilawah & Tartil",
  ],
  [2026, "Festival Kaligrafi Mahasiswa", "Provinsi", "Juara 2", "Kompetisi", "Khattil"],
  [2026, "Kompetisi Cerdas Cermat Qurani", "Nasional", "Juara 3", "Kompetisi", "Fahmil"],
  [
    2026,
    "Apresiasi Organisasi Mahasiswa",
    "Kampus",
    "Program Kolaborasi Terbaik",
    "Penghargaan",
    "KTDAQ",
  ],
  [
    2025,
    "Festival Banjari Pelajar dan Mahasiswa",
    "Kota",
    "Penampil Terbaik",
    "Kompetisi",
    "Banjari & Nasyid",
  ],
  [2025, "Pekan Syarhil Quran Mahasiswa", "Provinsi", "Juara 1", "Kompetisi", "Syarhil"],
  [2025, "Forum Gagasan Qurani", "Internasional", "Finalis", "Kompetisi", "Debat Ilmiah"],
  [
    2025,
    "Panggung Kolaborasi Seni Religi",
    "Kota",
    "Kolaborator Pilihan",
    "Kolaborasi",
    "Banjari & Nasyid",
  ],
  [
    2024,
    "Apresiasi Pembinaan Hafalan",
    "Kampus",
    "Program Pembinaan Terbaik",
    "Penghargaan",
    "Hifdzil",
  ],
  [
    2024,
    "Perjalanan Karya dan Pengabdian Anggota",
    "Kampus",
    "Sepuluh Karya Bersama",
    "Rekam Jejak",
    "KTDAQ",
  ],
];

const photoNames = Array.from({ length: 5 }, (_, i) => `sr-demo-2026-0${i + 1}.jpg`);
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const image = (ref) => ({ _type: "image", asset: { _type: "reference", _ref: ref } });
const block = (key, text, style = "normal") => ({
  _key: key,
  _type: "block",
  style,
  markDefs: [],
  children: [{ _key: `${key}-text`, _type: "span", text, marks: [] }],
});

function makeDocuments(assetIds) {
  const activities = stories.map(([jenis, title, category, date, summary], index) => {
    const eventIndex = index - 5;
    const photos = Array.from({ length: 5 }, (_, i) => assetIds[(index + i) % 5]);
    return {
      _id: `${prefix}${jenis}-${String((index % 5) + 1).padStart(2, "0")}`,
      _type: "beritaAcara",
      jenis,
      title: `[Demo] ${title}`,
      slug: { _type: "slug", current: `demo-${slugify(title)}` },
      category,
      date,
      image: image(photos[0]),
      description: `${summary} ${notice}`,
      body: [
        block(
          "intro",
          `${notice} Seluruh nama kegiatan, jadwal, lokasi, dan hasil dalam contoh ini bersifat simulasi.`,
        ),
        block("heading", "Tentang kegiatan", "h2"),
        block("story", summary),
        block(
          "process",
          "Proses diawali dengan perkenalan dan penyampaian tujuan, dilanjutkan dengan praktik dalam kelompok kecil. Setiap kelompok memperoleh kesempatan untuk mencoba, berdiskusi, serta menyampaikan hasil belajarnya.",
        ),
        block(
          "closing",
          "Pada akhir sesi, peserta berbagi pengalaman dan menyusun masukan untuk pertemuan selanjutnya. Dokumentasi di bawah digunakan untuk menguji susunan foto dan tampilan halaman detail.",
        ),
        block("photos", photoNotice),
      ],
      // The main photo is already included by the detail page: four extra = five total.
      gallery: photos.slice(1).map((ref, i) => ({
        ...image(ref),
        _key: `photo-${i + 2}`,
        alt: `Ilustrasi demo ${i + 2}: cuplikan company profile Seni Religi`,
        caption: `Dokumentasi contoh ${i + 2}. ${photoNotice}`,
      })),
      tags: ["Demo", "Seni Religi", category],
      ...(jenis === "acara"
        ? {
            status: ["upcoming", "upcoming", "ongoing", "completed", "completed"][eventIndex],
            time: "09.00 – 12.00 WIB",
            location: [
              "Aula Kampus — lokasi demo",
              "Ruang Kreatif — lokasi demo",
              "Panggung Terbuka — lokasi demo",
              "Ruang Pertemuan — lokasi demo",
              "Sekretariat — lokasi demo",
            ][eventIndex],
            agenda: [
              {
                _key: "registration",
                _type: "object",
                time: "09.00",
                item: "Registrasi dan pembukaan",
              },
              {
                _key: "introduction",
                _type: "object",
                time: "09.30",
                item: "Pengantar dan pembagian kelompok",
              },
              {
                _key: "session",
                _type: "object",
                time: "10.00",
                item: "Sesi utama dan praktik bersama",
              },
              {
                _key: "sharing",
                _type: "object",
                time: "11.30",
                item: "Apresiasi, dokumentasi, dan penutupan",
              },
            ],
          }
        : {}),
    };
  });
  return [
    ...activities,
    ...achievements.map(([year, title, level, position, category, field], index) => ({
      _id: `${prefix}prestasi-${String(index + 1).padStart(2, "0")}`,
      _type: "prestasi",
      year,
      title: `[Demo] ${title}`,
      level,
      position,
      category,
      field,
      description: `${notice} Contoh ini menampilkan pencapaian ${position.toLowerCase()} pada tingkat ${level.toLowerCase()} untuk bidang ${field}. Cerita simulasi mencakup persiapan anggota, latihan bersama, serta evaluasi setelah penampilan. Foto merupakan ilustrasi dari video company profile dan bukan bukti pencapaian tersebut.`,
      image: { ...image(assetIds[index % 5]), alt: photoNotice },
      organizer: "Panitia Kompetisi Demo",
      location: "Malang — lokasi demo",
      participants: Array.from({ length: (index % 3) + 1 }, (_, i) => ({
        _key: `participant-${i + 1}`,
        _type: "achievementParticipant",
        name: `Peserta Demo ${String(index + 1).padStart(2, "0")}${String.fromCharCode(65 + i)}`,
        faculty: [
          "Fakultas Ilmu Budaya (demo)",
          "Fakultas Teknik (demo)",
          "Fakultas Ilmu Sosial dan Ilmu Politik (demo)",
        ][i],
      })),
    })),
  ];
}

async function main() {
  const apply = process.argv.includes("--apply");
  const imagesArg = process.argv.indexOf("--images-dir");
  const imagesDir = imagesArg === -1 ? null : process.argv[imagesArg + 1];
  const client = getCliClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
  });
  const plan = makeDocuments(photoNames.map((_, i) => `demo-image-${i + 1}`));
  console.log(
    JSON.stringify(
      {
        mode: apply ? "apply" : "dry-run",
        projectId: client.config().projectId,
        dataset: client.config().dataset,
        documents: plan.map(({ _id, title }) => ({ _id, title })),
        total: plan.length,
        photosPerActivity: 5,
      },
      null,
      2,
    ),
  );
  if (!apply) return;
  if (!client.config().token)
    throw new Error(
      "Gunakan sanity exec --with-user-token atau SANITY_AUTH_TOKEN untuk menambahkan data.",
    );

  const existingAssets = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename in $names]{_id, originalFilename}',
    { names: photoNames },
  );
  // Validate every local file before starting any upload.
  for (const name of photoNames) {
    if (
      !existingAssets.some((asset) => asset.originalFilename === name) &&
      (!imagesDir || !existsSync(resolve(imagesDir, name)))
    ) {
      throw new Error(
        `Foto belum tersedia: ${name}. Berikan --images-dir yang berisi lima cuplikan video.`,
      );
    }
  }
  const assetIds = [];
  for (const name of photoNames) {
    let asset = existingAssets.find((entry) => entry.originalFilename === name);
    if (!asset) {
      asset = await client.assets.upload("image", createReadStream(resolve(imagesDir, name)), {
        filename: name,
        title: `[Demo] ${name}`,
        description: photoNotice,
      });
      console.log(`Uploaded ${name}`);
    }
    assetIds.push(asset._id);
  }
  const documents = makeDocuments(assetIds);
  const ids = documents.map(({ _id }) => _id);
  const existing = await client.fetch("*[_id in $ids || _id in $draftIds]._id", {
    ids,
    draftIds: ids.map((id) => `drafts.${id}`),
  });
  // Never overwrite an editor's changes or publish an existing draft on reruns.
  const additions = documents.filter(
    ({ _id }) => !existing.includes(_id) && !existing.includes(`drafts.${_id}`),
  );
  if (additions.length) {
    let transaction = client.transaction();
    for (const doc of additions) transaction = transaction.createIfNotExists(doc);
    await transaction.commit({ visibility: "sync" });
  }
  const result = await client.fetch(
    `*[_id in $ids]{
    _id, _type, title, jenis, "slug": slug.current,
    "imageResolved": defined(image.asset->url),
    "galleryCount": count(gallery),
    "resolvedGalleryCount": count(gallery[defined(asset->url)])
  }`,
    { ids },
  );
  if (
    result.some(
      (doc) =>
        !doc.imageResolved ||
        (doc._type === "beritaAcara" && (doc.galleryCount !== 4 || doc.resolvedGalleryCount !== 4)),
    )
  ) {
    throw new Error("Verifikasi foto gagal. Periksa dokumen demo di Studio.");
  }
  console.log(
    JSON.stringify(
      {
        created: additions.length,
        skipped: documents.length - additions.length,
        published: result.length,
        verified: result,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  // Sanity request errors can include Authorization headers; print only the message.
  console.error(error.message);
  process.exitCode = 1;
});
