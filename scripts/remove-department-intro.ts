import { existsSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

async function main() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const client = getCliClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "raw",
  });
  const docs = await client.fetch<Array<{ _id: string; _rev: string }>>(
    '*[_type == "departemen" && slug.current in ["bkrt", "minba", "psdm", "medkom"] && defined(description)]',
  );
  console.log(JSON.stringify({ documents: docs.map((d) => d._id), remove: "description" }));
  if (!process.argv.includes("--apply") || !docs.length) return;
  const backup = process.argv[process.argv.indexOf("--backup") + 1];
  if (!process.argv.includes("--backup") || !backup) throw new Error("Path --backup diperlukan.");
  writeFileSync(backup, JSON.stringify(docs, null, 2), { flag: "wx" });
  let transaction = client.transaction();
  for (const doc of docs) {
    transaction = transaction.patch(doc._id, (patch) =>
      patch.ifRevisionId(doc._rev).unset(["description"]),
    );
  }
  await transaction.commit();
  console.log("Teks pembuka departemen dihapus dari CMS. Thumbnail kartu tetap tersedia.");
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
