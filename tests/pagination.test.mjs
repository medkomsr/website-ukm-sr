import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import { archiveParams, fetchArchivePage } from "../lib/content/pagination.ts";
import { activityFilter, achievementFilter } from "../sanity/queries/archive-filters.ts";

const dataset = Array.from({ length: 113 }, (_, i) => ({
  _id: `item-${String(i).padStart(3, "0")}`,
  _type: "beritaAcara",
  slug: { current: `cerita-${i}` },
  jenis: i % 2 ? "acara" : "berita",
  category: i % 2 ? "Workshop" : "Liputan",
  status: i % 3 ? "completed" : "upcoming",
  title: i === 112 ? "Cerita halaman terakhir" : `Cerita ${i}`,
  description: "Latihan bersama",
}));
async function query(source, params, docs = dataset) {
  return (await evaluate(parse(source, { params }), { dataset: docs, params })).get();
}

test("113 records are split into non-overlapping pages of at most nine", async () => {
  const seen = [];
  for (let page = 1; page <= 13; page++) {
    const params = archiveParams({ page });
    const total = await query(`count(*[${activityFilter}])`, params);
    const result = await fetchArchivePage(total, page, (start, end) =>
      query(`*[${activityFilter}] | order(_id asc) [$start...$end]`, { ...params, start, end }),
    );
    assert.equal(result.items.length, page === 13 ? 5 : 9);
    assert.equal(result.total, 113);
    seen.push(...result.items.map((item) => item._id));
  }
  assert.equal(new Set(seen).size, 113);
});

test("mobile requests five records at a time and rejects oversized page sizes", async () => {
  const first = await fetchArchivePage(113, 1, async (start, end) => dataset.slice(start, end), 5);
  const next = await fetchArchivePage(113, 2, async (start, end) => dataset.slice(start, end), 5);
  assert.equal(first.pages, 23);
  assert.equal(first.items.length, 5);
  assert.equal(next.items.length, 5);
  assert.equal(new Set([...first.items, ...next.items].map((d) => d._id)).size, 10);
  assert.equal(archiveParams({ pageSize: 1000 }).pageSize, 9);
});

test("search and event filters run on the entire collection before pagination", async () => {
  const search = await query(`*[${activityFilter}]`, archiveParams({ search: "HALAMAN TERAKHIR" }));
  assert.deepEqual(
    search.map((d) => d._id),
    ["item-112"],
  );
  const events = await query(
    `*[${activityFilter}]`,
    archiveParams({ types: ["event"], category: "Workshop", status: "upcoming" }),
  );
  assert.equal(events.length, 19);
  assert.ok(events.every((d) => d.jenis === "acara" && d.status === "upcoming"));
  assert.equal((await query(`*[${activityFilter}]`, archiveParams({ types: [] }))).length, 0);
});

test("search treats wildcard and query-like input as literal text", async () => {
  for (const search of ["*", '"] || true', "no results"]) {
    assert.equal((await query(`*[${activityFilter}]`, archiveParams({ search }))).length, 0);
  }
});

test("achievement filters include participants and match year, field, category together", async () => {
  const docs = dataset.map((d, i) => ({
    ...d,
    _type: "prestasi",
    year: i % 2 ? 2025 : 2026,
    field: i % 2 ? "Khattil" : "Fahmil",
    category: "Kompetisi",
    participants: [{ name: i === 112 ? "Nadia Putri" : `Anggota ${i}` }],
  }));
  const matches = await query(
    `*[${achievementFilter}]`,
    archiveParams({ search: "nadia", year: "2026", field: "Fahmil", category: "Kompetisi" }),
    docs,
  );
  assert.deepEqual(
    matches.map((d) => d._id),
    ["item-112"],
  );
  assert.equal(
    (await query(`*[${achievementFilter}]`, archiveParams({ search: "nadia", year: "2025" }), docs))
      .length,
    0,
  );
});

test("invalid and stale page numbers clamp safely; an empty result fetches no items", async () => {
  for (const page of [-10, NaN, Infinity, 0]) assert.equal(archiveParams({ page }).page, 1);
  let bounds;
  const last = await fetchArchivePage(10, 99999, async (start, end) => {
    bounds = [start, end];
    return ["last"];
  });
  assert.equal(last.page, 2);
  assert.deepEqual(bounds, [9, 18]);
  const empty = await fetchArchivePage(0, 99, async () => {
    throw new Error("Should not fetch");
  });
  assert.deepEqual(empty, { total: 0, page: 1, pages: 1, items: [] });
});
