import assert from "node:assert/strict";
import test from "node:test";
import { dehydrate, hydrate, QueryClient, QueryObserver } from "@tanstack/react-query";
import { createQueryClient } from "../lib/query/client.ts";
import { seedArchive } from "../lib/query/seed-archive.ts";
import { CONTENT_STALE_TIME } from "../lib/query/constants.ts";

test("hydrated content is immediately readable and stays fresh when returning to a page", async () => {
  const server = new QueryClient();
  const browser = createQueryClient();
  const key = ["departemen", "bkrt"];
  server.setQueryData(key, { abbr: "BKRT" });
  hydrate(browser, dehydrate(server));
  let requests = 0;
  const observer = new QueryObserver(browser, {
    queryKey: key,
    queryFn: async () => {
      requests++;
      return { abbr: "BKRT" };
    },
    staleTime: CONTENT_STALE_TIME,
  });
  for (let visit = 0; visit < 2; visit++) {
    const unsubscribe = observer.subscribe(() => {});
    assert.equal(observer.getCurrentResult().data.abbr, "BKRT");
    assert.equal(observer.getCurrentResult().isPending, false);
    await new Promise((resolve) => setTimeout(resolve, 0));
    unsubscribe();
  }
  assert.equal(requests, 0);
  assert.ok(browser.getDefaultOptions().queries.gcTime >= CONTENT_STALE_TIME);
  server.clear();
  browser.clear();
});

test("desktop hydration seeds mobile with five records and the correct continuation page", () => {
  const client = new QueryClient();
  const filters = { page: 1, category: "all", search: "" };
  const items = Array.from({ length: 9 }, (_, id) => ({ id }));
  seedArchive(client, "aktivitas", filters, { items, total: 23, page: 1, pages: 3 });
  assert.equal(client.getQueryData(["aktivitas", "page", filters]).items.length, 9);
  const mobile = client.getQueryData(["aktivitas", "mobile", { category: "all", search: "" }]);
  assert.deepEqual(mobile.pageParams, [1]);
  assert.deepEqual(mobile.pages[0], { items: items.slice(0, 5), total: 23, page: 1, pages: 5 });
  assert.equal(
    client.getQueryData(["aktivitas", "mobile", { category: "Festival", search: "" }]),
    undefined,
  );
  client.clear();
});

test("empty archives hydrate as successful empty content, not a pending query", () => {
  const client = new QueryClient();
  seedArchive(client, "prestasi", { page: 1 }, { items: [], total: 0, page: 1, pages: 1 });
  const mobile = client.getQueryState(["prestasi", "mobile", {}]);
  assert.equal(mobile.status, "success");
  assert.deepEqual(mobile.data.pages[0], { items: [], total: 0, page: 1, pages: 1 });
  client.clear();
});
