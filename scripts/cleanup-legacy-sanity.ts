import { existsSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

// Retired types only. Never delete image/file assets or current content types.
const legacyTypes = [
  "artikel",
  "event",
  "galeri",
  "divisi",
  "kaligrafiItem",
  "kaligrafiCategory",
  "kaligrafiSettings",
  "siteSettings",
];
async function main() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const client = getCliClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "raw",
  });
  const docs = await client.fetch<Array<{ _id: string; _rev: string; _type: string }>>(
    "*[_type in $types]",
    { types: legacyTypes },
  );
  const ids = docs.map((d) => d._id);
  const externalRefs = ids.length
    ? await client.fetch<string[]>("*[references($ids) && !(_id in $ids)]._id", { ids })
    : [];
  console.log(
    JSON.stringify({ documents: docs.map(({ _id, _type }) => ({ _id, _type })), externalRefs }),
  );
  if (externalRefs.length)
    throw new Error("Ada referensi dari dokumen aktif; pembersihan dihentikan.");
  if (!process.argv.includes("--apply") || !docs.length) return;
  const backup = process.argv[process.argv.indexOf("--backup") + 1];
  if (!process.argv.includes("--backup") || !backup) throw new Error("Path --backup diperlukan.");
  writeFileSync(backup, docs.map((d) => JSON.stringify(d)).join("\n") + "\n", { flag: "wx" });
  await client.mutate(
    docs.map((doc) => ({
      delete: { query: "*[_id == $id && _rev == $rev]", params: { id: doc._id, rev: doc._rev } },
    })),
  );
  const remaining = await client.fetch<string[]>("*[_id in $ids]._id", { ids });
  console.log(JSON.stringify({ deleted: docs.length - remaining.length, remaining, backup }));
  if (remaining.length)
    throw new Error("Sebagian dokumen berubah saat audit; dokumen tersebut dipertahankan.");
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
