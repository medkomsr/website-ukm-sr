import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse, evaluate } from "groq-js";
import { readOne, fieldContent } from "../sanity/read-validation.ts";
import { bidangSchema } from "../sanity/schemas/bidang.ts";
import { srFields } from "../lib/constants/art-fields.ts";

const source = readFileSync(new URL("../sanity/queries/bidang.ts", import.meta.url), "utf8");
const projection = source.match(/const bidangProjection = groq`([\s\S]*?)`;/)[1];
const ketua = { name: "Ahmad Tri Fauzi", role: "Kepala Bidang Banjari & Nasyid" };
const wakil = { name: "Umar Hawadisy", role: "Wakil Kepala Bidang Banjari" };
const tambahan = { name: "Lutfiah Putri Aryanti", role: "Wakil Kepala Bidang Nasyid" };

async function readProfile(slug, extra = tambahan) {
  const document = {
    _id: `bidang-${slug}`,
    _type: "bidang",
    slug: { current: slug },
    abbr: slug,
    ketuaBidang: ketua,
    wakilKetuaBidang: wakil,
    wakilKetuaBidangTambahan: extra,
  };
  const result = await evaluate(parse(`*[0] ${projection}`), { dataset: [document] });
  return readOne(fieldContent, await result.get());
}

test("Banjari & Nasyid reads three distinct officers without photos", async () => {
  const profile = await readProfile("banjari-nasyid");
  const officers = [
    profile.ketuaBidang,
    profile.wakilKetuaBidang,
    profile.wakilKetuaBidangTambahan,
  ];
  assert.deepEqual(
    officers.map(({ name, role }) => ({ name, role })),
    [ketua, wakil, tambahan],
  );
  assert.ok(officers.every((member) => !member.imageUrl));
});

test("other fields keep two officers and do not expose the extra Studio field", async () => {
  const extraField = bidangSchema.fields.find((field) => field.name === "wakilKetuaBidangTambahan");
  for (const { slug } of srFields) {
    const profile = await readProfile(slug);
    assert.equal(
      extraField.hidden({ document: { slug: { current: slug } } }),
      slug !== "banjari-nasyid",
    );
    if (slug === "banjari-nasyid") continue;
    assert.equal(profile.ketuaBidang.name, ketua.name);
    assert.equal(profile.wakilKetuaBidang.name, wakil.name);
    assert.equal(profile.wakilKetuaBidangTambahan, undefined);
  }
});

test("missing or incomplete extra deputy does not break existing officers", async () => {
  for (const extra of [null, { role: "Wakil" }]) {
    const profile = await readProfile("banjari-nasyid", extra);
    assert.equal(profile.ketuaBidang.name, ketua.name);
    assert.equal(profile.wakilKetuaBidang.name, wakil.name);
    assert.equal(profile.wakilKetuaBidangTambahan, undefined);
  }
});
