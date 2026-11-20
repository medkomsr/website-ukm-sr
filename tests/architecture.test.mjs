import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const roots = ["app", "features", "components", "hooks", "lib", "providers", "sanity"];
const sources = roots.flatMap((root) =>
  readdirSync(root, { recursive: true })
    .map((file) => `${root}/${file.replaceAll("\\", "/")}`)
    .filter((file) => /\.(ts|tsx)$/.test(file)),
);

test("dependency direction and Next.js public APIs remain explicit", () => {
  const violations = [];
  for (const file of sources) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    function inspect(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const specifier = node.moduleSpecifier.text;
        const local = specifier.startsWith("@/")
          ? specifier.slice(2)
          : specifier.startsWith(".")
            ? path.posix.join(path.posix.dirname(file), specifier)
            : null;
        if (specifier.startsWith("next/dist/")) violations.push(`${file}: internal Next.js import`);
        if (local) {
          if (!file.startsWith("app/") && local.startsWith("app/"))
            violations.push(`${file}: depends on routing layer`);
          if (/^(components|lib)\//.test(file) && local.startsWith("features/"))
            violations.push(`${file}: shared code depends on feature`);
          if (
            file.startsWith("features/") &&
            !file.includes("/server/") &&
            local.includes("/server/")
          )
            violations.push(`${file}: client feature depends on server implementation`);
          if (
            !["", ".ts", ".tsx", "/index.ts", "/index.tsx"].some((ext) => existsSync(local + ext))
          )
            violations.push(`${file}: unresolved ${specifier}`);
        }
      }
      ts.forEachChild(node, inspect);
    }
    inspect(source);
  }
  assert.deepEqual(violations, []);
});
