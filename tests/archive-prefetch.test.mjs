import assert from "node:assert/strict";
import test from "node:test";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { prefetchNextArchivePage } from "../lib/query/prefetch-archive.ts";
import { CONTENT_STALE_TIME } from "../lib/query/constants.ts";

test("next-page navigation reads prefetched results without another request", async () => {
  const client = new QueryClient();
  const filters = { page: 1, types: ["article", "event"], search: "", category: "all" };
  const current = { page: 1, pages: 3, total: 23, items: [] };
  const requests = [];
  const fetchPage = async (input) => {
    requests.push(input);
    return { ...current, page: input.page, items: [{ _id: "page-two" }] };
  };
  try {
    await prefetchNextArchivePage(client, "aktivitas", fetchPage, filters, current);
    await prefetchNextArchivePage(client, "aktivitas", fetchPage, filters, current);
    const next = { ...filters, page: 2 };
    const observer = new QueryObserver(client, {
      queryKey: ["aktivitas", "page", next],
      queryFn: () => fetchPage(next),
      staleTime: CONTENT_STALE_TIME,
    });
    const unsubscribe = observer.subscribe(() => {});
    assert.equal(observer.getCurrentResult().isFetching, false);
    assert.equal(observer.getCurrentResult().data.items[0]._id, "page-two");
    unsubscribe();
    assert.deepEqual(requests, [next]);
    assert.equal(
      client.getQueryData(["aktivitas", "page", { ...next, search: "other" }]),
      undefined,
    );
    assert.equal(client.getQueryData(["prestasi", "page", next]), undefined);
  } finally {
    client.clear();
  }
});

test("prefetch stops at the final page and ignores previous-page placeholder data", async () => {
  const client = new QueryClient();
  let requests = 0;
  const fetchPage = async () => {
    requests++;
  };
  try {
    await prefetchNextArchivePage(
      client,
      "aktivitas",
      fetchPage,
      { page: 2 },
      { page: 1, pages: 3 },
    );
    await prefetchNextArchivePage(
      client,
      "aktivitas",
      fetchPage,
      { page: 2 },
      { page: 2, pages: 2 },
    );
    await prefetchNextArchivePage(client, "aktivitas", fetchPage, {}, { page: 1, pages: 1 });
    assert.equal(requests, 0);
  } finally {
    client.clear();
  }
});

test("failed background prefetch leaves the current page intact and navigation can retry", async () => {
  const client = new QueryClient();
  const current = { page: 1, pages: 2, total: 10, items: [{ _id: "current" }] };
  client.setQueryData(["aktivitas", "page", { page: 1 }], current);
  try {
    await prefetchNextArchivePage(
      client,
      "aktivitas",
      async () => {
        throw new Error("offline");
      },
      { page: 1 },
      current,
    );
    assert.deepEqual(client.getQueryData(["aktivitas", "page", { page: 1 }]), current);
    const result = await client.fetchQuery({
      queryKey: ["aktivitas", "page", { page: 2 }],
      queryFn: async () => ({ ...current, page: 2 }),
    });
    assert.equal(result.page, 2);
  } finally {
    client.clear();
  }
});
