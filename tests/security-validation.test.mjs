import test from "node:test";
import assert from "node:assert/strict";
import { encodeSignatureHeader } from "@sanity/webhook";
import { textValue, validSlug, checkImageMetadata } from "../sanity/validation.ts";
import {
  readOne,
  activityContent,
  fieldContent,
  listOf,
  visionContent,
  isSafeSlug,
} from "../sanity/read-validation.ts";
import { createRevalidateHandler } from "../lib/content/revalidate-handler.ts";

test("editor text rejects whitespace, control characters and excessive length", () => {
  for (const value of [undefined, "  ", "a".repeat(121), "a\u0000b"])
    assert.notEqual(textValue(120, true)(value), true);
  assert.equal(textValue(120, true)("Judul kegiatan yang valid"), true);
  assert.equal(textValue(120)(undefined), true);
});
test("slugs cannot contain paths, fragments, query strings or oversized cache tags", () => {
  for (const current of ["berita/uji?x=1#frag", "Nama Besar", "a".repeat(97), "-awal", "akhir-"]) {
    assert.notEqual(validSlug({ current }), true);
    assert.equal(isSafeSlug(current), false);
  }
  assert.equal(validSlug({ current: "berita-2026" }), true);
  assert.equal(isSafeSlug({}), false);
});
test("image publish validation checks size, MIME and dimensions", () => {
  const image = {
    size: 1024,
    mimeType: "image/webp",
    metadata: { dimensions: { width: 800, height: 600 } },
  };
  assert.equal(checkImageMetadata(image), true);
  for (const value of [
    null,
    { ...image, size: 6 * 1024 * 1024 },
    { ...image, mimeType: "image/svg+xml" },
    { ...image, metadata: { dimensions: { width: 40, height: 40 } } },
  ])
    assert.notEqual(checkImageMetadata(value), true);
});
test("malformed imported content cannot inject objects into text or broken member arrays", () => {
  const field = readOne(fieldContent, {
    _id: "field",
    slug: "ktdaq",
    abbr: "KTDAQ",
    description: { bad: true },
    gallery: [null, 5],
    ketuaBidang: { role: "Ketua" },
  });
  assert.equal(field.description, "");
  assert.equal(field.ketuaBidang, undefined);
  assert.deepEqual(field.gallery, []);
  assert.deepEqual(readOne(visionContent, { visi: { bad: true }, misi: ["Valid", {}] }), {
    visi: "",
    misi: ["Valid"],
  });
  assert.deepEqual(listOf(activityContent).parse([null, { title: "No ID" }]), []);
});
const secret = "test-only-secret-32-characters-long-enough";
async function webhook(payload, secretValue = secret) {
  const body = JSON.stringify(payload);
  return new Request("https://example.test/api/sanity/revalidate", {
    method: "POST",
    body,
    headers: {
      "content-type": "application/json",
      "sanity-webhook-signature": await encodeSignatureHeader(body, Date.now(), secretValue),
    },
  });
}
test("webhook rejects invalid signatures and ignores untrusted paths/tags", async () => {
  const calls = [];
  const handler = createRevalidateHandler(
    (tag) => calls.push(tag),
    () => secret,
  );
  assert.equal(
    (await handler(await webhook({ _id: "a", _type: "beritaAcara" }, "wrong"))).status,
    401,
  );
  assert.deepEqual(calls, []);
  assert.equal(
    (
      await handler(
        await webhook({ _id: "a", _type: "beritaAcara", tags: ["anything"], path: "/" }),
      )
    ).status,
    200,
  );
  assert.deepEqual(calls, ["aktivitas"]);
  await handler(await webhook({ _id: "drafts.a", _type: "prestasi" }));
  await handler(await webhook({ _id: "a", _type: "constructor" }));
  assert.deepEqual(calls, ["aktivitas"]);
});
test("webhook handles deletion payloads and refuses missing configuration/oversized bodies", async () => {
  const calls = [];
  const handler = createRevalidateHandler(
    (tag) => calls.push(tag),
    () => secret,
  );
  await handler(await webhook({ _id: "deleted-id", _type: "departemen" }));
  assert.deepEqual(calls, ["departemen"]);
  assert.equal(
    (
      await createRevalidateHandler(
        () => {},
        () => undefined,
      )(await webhook({ _id: "a", _type: "faq" }))
    ).status,
    503,
  );
  assert.equal(
    (await handler(await webhook({ _id: "a", _type: "faq", extra: "x".repeat(17000) }))).status,
    413,
  );
});
