"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

const singletonTypes = new Set(["homePage", "visiMisi", "kabinet", "faq"]);
const singletonActions = new Set(["publish", "discardChanges", "restore"]);
// Only types reachable from the sidebar may be created; extend as each page is reorganised.
const creatableTypes = new Set(["beritaAcara", "departemen", "bidang", "prestasi"]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemas' folder
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
      // Used by the ready-made cabinet and art-field items in the sidebar.
      ...(["departemen", "bidang"] as const).map((schemaType) => ({
        id: `${schemaType}-preset`,
        title: schemaType === "departemen" ? "Pengurus Departemen" : "Pengurus Bidang",
        schemaType,
        parameters: [
          { name: "abbr", type: "string" },
          { name: "slug", type: "string" },
        ],
        value: ({ abbr, slug }: { abbr: string; slug: string }) => ({
          abbr,
          slug: { _type: "slug", current: slug },
        }),
      })),
    ],
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
    newDocumentOptions: (options) =>
      options.filter(({ templateId }) => creatableTypes.has(templateId)),
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
