import { existsSync } from "node:fs";
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
  const docs = await client.fetch<Array<{ _id: string; _type: string; slug?: string }>>(
    '*[!(_type match "system.*") && !(_type match "sanity.*")]{_id,_type,"slug":slug.current}',
  );
  const counts: Record<string, number> = {};
  for (const doc of docs) counts[doc._type] = (counts[doc._type] ?? 0) + 1;
  const published = docs.filter(
    (d) => !d._id.startsWith("drafts.") && !d._id.startsWith("versions."),
  );
  const groups = new Map<string, string[]>();
  for (const d of published) {
    if (!d.slug) continue;
    const key = `${d._type}/${d.slug}`;
    groups.set(key, [...(groups.get(key) ?? []), d._id]);
  }
  const legacyTypes = [
    "artikel",
    "event",
    "siteSettings",
    "divisi",
    "galeri",
    "kaligrafiCategory",
    "kaligrafiItem",
    "kaligrafiSettings",
  ];
  const legacy = docs.filter((d) => legacyTypes.includes(d._type));
  console.log(
    JSON.stringify(
      {
        counts,
        legacy,
        duplicateSlugs: [...groups].filter(([, ids]) => ids.length > 1),
        singletons: docs.filter((d) =>
          ["homePage", "visiMisi", "kabinet", "faq"].includes(d._type),
        ),
      },
      null,
      2,
    ),
  );
  for (const doc of legacy) {
    const refs = await client.fetch<string[]>("*[references($id)]._id", { id: doc._id });
    console.log(JSON.stringify({ id: doc._id, referencedBy: refs }));
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
