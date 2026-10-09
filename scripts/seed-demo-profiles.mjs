import { existsSync } from "node:fs";
import { getCliClient } from "sanity/cli";

// Preview first; apply with Sanity's authenticated CLI and --apply.
// Only fills empty fields on the two requested profiles; never replaces editor content.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const image = (ref) => ({ _type: "image", asset: { _type: "reference", _ref: ref } });
const notice =
  "Data demo untuk pratinjau; foto ilustrasi dari video company profile, bukan identitas atau kegiatan resmi.";

async function main() {
  const client = getCliClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
  });
  const assets = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename in $names]{_id,originalFilename}',
    { names: Array.from({ length: 5 }, (_, i) => `sr-demo-2026-0${i + 1}.jpg`) },
  );
  const photos = Array.from({ length: 5 }, (_, i) => {
    const asset = assets.find((a) => a.originalFilename === `sr-demo-2026-0${i + 1}.jpg`);
    if (!asset) throw new Error(`Foto demo ${i + 1} belum tersedia.`);
    return image(asset._id);
  });
  const plans = [
    {
      _id: "demo-sr-2026-bidang-ktdaq",
      _type: "bidang",
      abbr: "KTDAQ",
      slug: { _type: "slug", current: "ktdaq" },
      ketuaBidang: {
        _type: "object",
        name: "[Demo] Pengurus KTDAQ 01",
        role: "Ketua bidang (demo · foto ilustrasi)",
        image: photos[1],
      },
      wakilKetuaBidang: {
        _type: "object",
        name: "[Demo] Pengurus KTDAQ 02",
        role: "Wakil ketua bidang (demo · foto ilustrasi)",
        image: photos[2],
      },
      gallery: photos.map((photo, i) => ({
        _type: "object",
        _key: `demo-ktdaq-${i + 1}`,
        image: photo,
        caption: `[Demo] Dokumentasi KTDAQ ${i + 1}. ${notice}`,
        alt: `Ilustrasi dokumentasi KTDAQ ${i + 1}, cuplikan video company profile`,
      })),
    },
    {
      _id: "demo-sr-2026-departemen-bkrt",
      _type: "departemen",
      abbr: "BKRT",
      slug: { _type: "slug", current: "bkrt" },
      programKerja: [
        "Inventarisasi Perlengkapan",
        "Perawatan Ruang Bersama",
        "Dukungan Sarana Kegiatan",
      ].map((nama, i) => ({
        _type: "programKerja",
        _key: `demo-program-${i + 1}`,
        nama: `[Demo] ${nama}`,
        detail: notice,
        foto: photos[i],
      })),
      pengurus: [
        "Koordinator",
        "Sekretaris",
        "Penanggung Jawab Inventaris",
        "Penanggung Jawab Ruangan",
        "Staf Sarana",
      ].map((jabatan, i) => ({
        _type: "pengurus",
        _key: `demo-pengurus-${i + 1}`,
        nama: `[Demo] Pengurus BKRT 0${i + 1}`,
        jabatan: `${jabatan} (demo · foto ilustrasi)`,
        foto: photos[i],
      })),
    },
  ];
  const operations = [];
  for (const plan of plans) {
    const matches = await client.fetch("*[_type == $type && slug.current == $slug]", {
      type: plan._type,
      slug: plan.slug.current,
    });
    if (matches.some((doc) => doc._id.startsWith("drafts.")))
      throw new Error(`Profil ${plan.abbr} memiliki draft; tidak diubah otomatis.`);
    if (matches.length > 1)
      throw new Error(`Ada duplikat slug ${plan.slug.current}; tidak diubah otomatis.`);
    const existing = matches[0];
    if (!existing) operations.push({ create: plan });
    else {
      const fields =
        plan._type === "bidang"
          ? ["ketuaBidang", "wakilKetuaBidang", "gallery"]
          : ["programKerja", "pengurus"];
      const set = {};
      for (const field of fields) {
        const value = existing[field];
        if (
          value == null ||
          (Array.isArray(value) && !value.length) ||
          (!Array.isArray(value) && !value.name && !value.image)
        )
          set[field] = plan[field];
      }
      if (Object.keys(set).length)
        operations.push({ patch: { id: existing._id, ifRevisionID: existing._rev, set } });
    }
  }
  console.log(
    JSON.stringify(
      { mode: process.argv.includes("--apply") ? "apply" : "preview", operations },
      null,
      2,
    ),
  );
  if (process.argv.includes("--apply") && operations.length) {
    if (!client.config().token) throw new Error("Jalankan lewat sanity exec --with-user-token.");
    let transaction = client.transaction();
    for (const op of operations) {
      if (op.create) transaction = transaction.createIfNotExists(op.create);
      else
        transaction = transaction.patch(op.patch.id, (patch) =>
          patch.ifRevisionId(op.patch.ifRevisionID).set(op.patch.set),
        );
    }
    await transaction.commit({ visibility: "sync" });
  }
  console.log(
    JSON.stringify(
      await client.fetch(`*[( _type == "bidang" && slug.current == "ktdaq") || (_type == "departemen" && slug.current == "bkrt")]{
    _id, "slug":slug.current,
    "ketuaPhoto":defined(ketuaBidang.image.asset->url),
    "wakilPhoto":defined(wakilKetuaBidang.image.asset->url),
    "galleryPhotos":count(gallery[defined(image.asset->url)]),
    "programPhotos":count(programKerja[defined(foto.asset->url)]),
    "memberPhotos":count(pengurus[defined(foto.asset->url)])
  }`),
      null,
      2,
    ),
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
