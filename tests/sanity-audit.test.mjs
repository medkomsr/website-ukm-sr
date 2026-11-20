import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import {
  HOME_PAGE_SELECTOR,
  VISI_MISI_SELECTOR,
  BIDANG_CARDS_QUERY,
} from "../sanity/queries/selectors.ts";
import { fixedProfileSlug } from "../sanity/presets.ts";

test("singletons read the exact document edited by Studio even when legacy copies exist", async () => {
  for (const [type, selector] of [
    ["homePage", HOME_PAGE_SELECTOR],
    ["visiMisi", VISI_MISI_SELECTOR],
  ]) {
    const dataset = [
      { _id: "old-copy", _type: type },
      { _id: type, _type: type },
    ];
    assert.equal((await (await evaluate(parse(selector), { dataset })).get())._id, type);
  }
});

test("field cards do not fetch galleries or member details", async () => {
  const dataset = [
    {
      _id: "bidang-ktdaq",
      _type: "bidang",
      slug: { current: "ktdaq" },
      abbr: "KTDAQ",
      gallery: Array(100).fill({ caption: "photo" }),
      ketuaBidang: { name: "Example" },
    },
  ];
  const cards = await (await evaluate(parse(BIDANG_CARDS_QUERY), { dataset })).get();
  assert.equal(cards[0].slug, "ktdaq");
  assert.equal("gallery" in cards[0], false);
  assert.equal("ketuaBidang" in cards[0], false);
});

test("preset slugs stay attached to their published and draft document IDs", () => {
  assert.equal(fixedProfileSlug("bidang", "drafts.bidang-ktdaq"), "ktdaq");
  assert.equal(fixedProfileSlug("departemen", "departemen-bkrt"), "bkrt");
  assert.equal(fixedProfileSlug("bidang", "custom-id"), undefined);
});
