import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { evaluate, parse } from "groq-js";
import { buildSitemap, SITEMAP_QUERY } from "../sanity/queries/sitemap.ts";

const origin = "https://senireligi.ub.ac.id";
const updated = "2026-10-01T09:14:00Z";

function doc(_type, slug, fields = {}) {
  return {
    _type,
    _id: `${_type}-${slug}`,
    slug: { current: slug },
    _updatedAt: updated,
    ...fields,
  };
}

async function sitemapFor(dataset) {
  const rows = await (await evaluate(parse(SITEMAP_QUERY), { dataset })).get();
  return buildSitemap(rows);
}

test("published detail routes follow Sanity additions, edits and removals", async () => {
  const article = doc("beritaAcara", "mtq-ub-xix", { title: "MTQ UB XIX" });
  const next = doc("beritaAcara", "festival-hadrah", { jenis: "acara", title: "Festival Hadrah" });
  const records = [
    article,
    doc("bidang", "banjari-nasyid", { abbr: "BN" }),
    doc("departemen", "medkom", { abbr: "MEDKOM" }),
    doc("prestasi", "juara-umum", { title: "Juara umum" }),
    doc("beritaAcara", "draf", { _id: "drafts.draf", title: "Draf" }),
    doc("beritaAcara", "belum-rilis", { _id: "versions.future.story", title: "Upcoming" }),
    doc("departemen", "tanpa-nama", { abbr: "" }),
    doc("beritaAcara", "tanpa-judul"),
    doc("bidang", "../studio", { abbr: "Invalid" }),
  ];
  const urls = (await sitemapFor(records)).map(({ url }) => url);
  assert.deepEqual(
    new Set(urls),
    new Set(
      [
        "/",
        "/tentang",
        "/aktivitas",
        "/prestasi",
        "/kontak",
        "/aktivitas/mtq-ub-xix",
        "/tentang/bidang/banjari-nasyid",
        "/tentang/medkom",
      ].map((path) => origin + path),
    ),
  );
  const later = await sitemapFor([
    ...records.slice(1),
    next,
    { ...next, _id: "duplicate-story" },
    doc("departemen", "baru", { abbr: "B", _updatedAt: "not-a-date" }),
  ]);
  assert.deepEqual(
    later.filter(({ url }) => url === origin + "/aktivitas/festival-hadrah"),
    [{ url: origin + "/aktivitas/festival-hadrah", lastModified: updated }],
  );
  assert.ok(!later.some(({ url }) => url === origin + "/aktivitas/mtq-ub-xix"));
  assert.deepEqual(
    later.find(({ url }) => url === origin + "/tentang/baru"),
    { url: origin + "/tentang/baru" },
  );
  assert.deepEqual(later[0], { url: origin + "/" });
  const edit = await sitemapFor([{ ...next, _updatedAt: "2026-10-02T12:00:00Z" }]);
  assert.equal(edit.at(-1).lastModified, "2026-10-02T12:00:00Z");
});

test("all valid detail pages appear beyond the normal CMS list limit", async () => {
  const dataset = Array.from({ length: 220 }, (_, i) =>
    doc("beritaAcara", `kegiatan-${i}`, { title: `Kegiatan ${i}` }),
  );
  const entries = await sitemapFor(dataset);
  assert.equal(entries.length, dataset.length + 5);
  assert.ok(entries.some(({ url }) => url === origin + "/aktivitas/kegiatan-219"));
});

test("the metadata route owns the existing sitemap URL", () => {
  assert.ok(existsSync(new URL("../app/sitemap.ts", import.meta.url)));
  assert.ok(!existsSync(new URL("../public/sitemap.xml", import.meta.url)));
});
