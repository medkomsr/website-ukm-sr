import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "@/sanity/client";
import { buildSitemap, SITEMAP_QUERY } from "@/sanity/queries/sitemap";

async function getSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");
  cacheTag("aktivitas", "departemen", "bidang");

  const records = await client.fetch<unknown>(SITEMAP_QUERY, {}, { perspective: "published" });
  return buildSitemap(records);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemap();
}
