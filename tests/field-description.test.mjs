import { test } from "node:test";
import assert from "node:assert/strict";
import { validateFieldDescription } from "../lib/content/field-description.ts";
import { srFields } from "../lib/constants/art-fields.ts";

test("field descriptions reject empty, oversized and multiline text", () => {
  for (const value of [
    undefined,
    null,
    "",
    "   ",
    "\n",
    "x".repeat(351),
    "a ".repeat(51),
    "Satu\nDua",
    "Satu\u2028Dua",
  ]) {
    assert.equal(typeof validateFieldDescription(value), "string");
  }
  assert.equal(validateFieldDescription("x".repeat(350)), true);
  assert.equal(validateFieldDescription(Array(50).fill("kata").join(" ")), true);
});

test("all eight default field descriptions fit the CMS limits", () => {
  for (const field of srFields)
    assert.equal(validateFieldDescription(field.description), true, field.slug);
});
