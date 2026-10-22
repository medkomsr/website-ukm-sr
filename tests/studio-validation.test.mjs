import test from "node:test";
import assert from "node:assert/strict";
import { resolveConfig, validateDocument } from "sanity";
import { createClient } from "@sanity/client";
import { firstValueFrom, of } from "rxjs";
import { beritaAcaraSchema } from "../sanity/schemas/beritaAcara.ts";
import { bidangSchema } from "../sanity/schemas/bidang.ts";
import { departemenSchema } from "../sanity/schemas/departemen.ts";

test("Studio blocks publication for invalid slugs and oversized image assets", async () => {
  const client = createClient({
    projectId: "unused",
    dataset: "test",
    apiVersion: "2024-01-01",
    useCdn: false,
  });
  const [workspace] = await firstValueFrom(
    resolveConfig([
      {
        name: "test",
        basePath: "/",
        projectId: "unused",
        dataset: "test",
        schema: { types: [beritaAcaraSchema, bidangSchema, departemenSchema] },
        auth: { state: of({ authenticated: false, client, currentUser: null }) },
      },
    ]),
  );
  // All document/asset lookups are local fixtures: no writes or network requests.
  const fakeClient = {
    config: () => ({ projectId: "unused", dataset: "test" }),
    withConfig: () => fakeClient,
    fetch: async (query) =>
      query.includes("sanity.imageAsset")
        ? {
            size: 6 * 1024 * 1024,
            mimeType: "image/jpeg",
            metadata: { dimensions: { width: 800, height: 600 } },
          }
        : true,
  };
  for (const type of ["beritaAcara", "bidang", "departemen"]) {
    const markers = await validateDocument({
      document: {
        _id: "fixture",
        _type: type,
        slug: { _type: "slug", current: "bad/path" },
        image: { _type: "image", asset: { _type: "reference", _ref: "image-fixture-800x600-jpg" } },
      },
      workspace,
      // CLI mode downgrades object rules to warnings; Studio must block publication.
      environment: "studio",
      getClient: () => fakeClient,
      getDocumentExists: async () => true,
    });
    assert.ok(
      markers.some(
        (m) => m.path[0] === "slug" && m.level === "error" && m.message.includes("huruf kecil"),
      ),
      type,
    );
    assert.ok(
      markers.some(
        (m) => m.path[0] === "image" && m.level === "error" && m.message.includes("5 MB"),
      ),
      type,
    );
  }
});
