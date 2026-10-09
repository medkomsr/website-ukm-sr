import { existsSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { srFields } from "../lib/constants/art-fields";
import { validateFieldDescription } from "../lib/content/field-description";

async function main() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const client = getCliClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "raw",
  });
  const docs =
    await client.fetch<
      Array<{ _id: string; _rev: string; slug?: { current?: string }; description?: string }>
    >('*[_type == "bidang"]');
  const suffix =
    " Pembinaan dilakukan melalui latihan rutin, diskusi karya, serta evaluasi bersama pembimbing. Contoh konten untuk pratinjau; nama pengurus dan foto merupakan ilustrasi.";
  const changes = docs.flatMap((doc) => {
    const field = srFields.find((f) => f.slug === doc.slug?.current);
    // Only our exact seeded copy is replaced; preserve any editor changes.
    if (!field || doc.description !== field.description + suffix) return [];
    if (validateFieldDescription(field.description) !== true)
      throw new Error(`Deskripsi ${field.slug} tidak valid.`);
    return [{ doc, description: field.description }];
  });
  console.log(
    JSON.stringify({
      update: changes.map(({ doc }) => doc._id),
      otherInvalid: docs
        .filter(
          (d) =>
            validateFieldDescription(d.description) !== true &&
            !changes.some(({ doc }) => doc._id === d._id),
        )
        .map((d) => d._id),
    }),
  );
  if (!process.argv.includes("--apply") || !changes.length) return;
  const backup = process.argv[process.argv.indexOf("--backup") + 1];
  if (!process.argv.includes("--backup") || !backup) throw new Error("Path --backup diperlukan.");
  writeFileSync(
    backup,
    JSON.stringify(
      changes.map(({ doc }) => doc),
      null,
      2,
    ),
    { flag: "wx" },
  );
  let tx = client.transaction();
  for (const { doc, description } of changes)
    tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ description }));
  await tx.commit();
  console.log(`Deskripsi dummy diringkas: ${changes.length} dokumen.`);
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
