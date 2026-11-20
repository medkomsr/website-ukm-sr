import type { MetadataRoute } from "next";
import { z } from "zod";
import { activityIdentity, profileCard } from "../read-validation";

const origin = "https://senireligi.ub.ac.id";
const pagePaths = ["/", "/tentang", "/aktivitas", "/prestasi", "/kontak"];
const detailPaths = {
  beritaAcara: "/aktivitas",
  departemen: "/tentang",
  bidang: "/tentang/bidang",
};

export const SITEMAP_QUERY = `*[
  _type in ["beritaAcara", "departemen", "bidang"] && defined(slug.current) &&
  !(_id in path("drafts.**")) && !(_id in path("versions.**"))
] | order(_type asc, slug.current asc, _id asc) {
  _type, _id, _updatedAt, "slug": slug.current,
  _type == "beritaAcara" => { title, "type": select(jenis == "acara" => "event", "article") },
  _type in ["departemen", "bidang"] => { abbr }
}`;

const updatedAt = z.iso.datetime({ offset: true }).optional().catch(undefined);
const profile = profileCard.pick({ _id: true, slug: true, abbr: true });
const record = z.discriminatedUnion("_type", [
  activityIdentity.extend({ _type: z.literal("beritaAcara"), _updatedAt: updatedAt }),
  profile.extend({ _type: z.enum(["departemen", "bidang"]), _updatedAt: updatedAt }),
]);

export function buildSitemap(records: unknown): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = pagePaths.map((path) => ({ url: origin + path }));
  const seen = new Set(entries.map(({ url }) => url));

  for (const item of z.array(z.unknown()).parse(records)) {
    const result = record.safeParse(item);
    if (!result.success) continue;
    const { _type, slug, _updatedAt } = result.data;
    const url = `${origin}${detailPaths[_type]}/${slug}`;
    if (seen.has(url)) continue;
    seen.add(url);
    entries.push(_updatedAt ? { url, lastModified: _updatedAt } : { url });
  }
  return entries;
}
