import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { compile } from "sass";
import { transform } from "lightningcss";

const baseline = JSON.parse(
  readFileSync(new URL("./fixtures/approved-styles.json", import.meta.url)),
);

// Compare generated CSS, not SCSS formatting. Moving rules across partials is safe;
// altering values, selector specificity or cascade order must fail this contract.
for (const [file, approved] of Object.entries(baseline.styles)) {
  test(`approved visual styling: ${file}`, () => {
    const css = compile(file, { logger: { warn() {} } }).css;
    const output = transform({ filename: "style.css", code: Buffer.from(css), minify: true }).code;
    // Custom-property token streams retain comma whitespace through minification.
    const normalized = output
      .toString()
      .replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|,\s+/g, (match, quoted) => quoted ?? ",");
    assert.equal(createHash("sha256").update(normalized).digest("hex"), approved.sha256);
  });
}
