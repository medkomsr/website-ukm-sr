import { srFields } from "@/lib/constants/art-fields";

/**
 * Documents the public cards expect. Must match `structure` in
 * features/about/components/cabinet.tsx and the art-field slugs.
 */
export const departemenPresets = [
  { abbr: "BKRT", slug: "bkrt" },
  { abbr: "Minba", slug: "minba" },
  { abbr: "PSDM", slug: "psdm" },
  { abbr: "Medkom", slug: "medkom" },
];

export const bidangPresets = srFields.map(({ name, slug }) => ({ abbr: name, slug }));

export const presetDocumentId = (type: "departemen" | "bidang", slug: string) => `${type}-${slug}`;

export function fixedProfileSlug(type: "departemen" | "bidang", documentId?: string) {
  const id = documentId?.replace(/^drafts\./, "");
  const presets = type === "departemen" ? departemenPresets : bidangPresets;
  return presets.find(({ slug }) => presetDocumentId(type, slug) === id)?.slug;
}
