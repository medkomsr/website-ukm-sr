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
