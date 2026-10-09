"use server";

import { achievementFilter } from "@/sanity/queries/archive-filters";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import type { SanityPrestasi } from "@/sanity/types";

import { archiveParams, fetchArchivePage, type ArchiveFilters } from "@/lib/content/pagination";

const HOME_ACHIEVEMENT_LIMIT = 5;

const prestasiProjection = groq`{
  _id,
  title,
  description,
  year,
  category,
  level,
  position,
  field,
  organizer,
  location,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  "participants": participants[]{ _key, name, faculty, "imageUrl": image.asset->url }
}`;

export async function getPrestasiPage(input: ArchiveFilters = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("prestasi");
  const params = archiveParams(input);
  const total = await client.fetch<number>(`count(*[${achievementFilter}])`, params);
  return fetchArchivePage(
    total,
    params.page,
    (start, end) =>
      client.fetch<SanityPrestasi[]>(
        `*[${achievementFilter}] | order(year desc, _createdAt desc, _id asc) [$start...$end] ${prestasiProjection}`,
        { ...params, start, end },
      ),
    params.pageSize,
  );
}

export async function getPrestasiMeta() {
  "use cache";
  cacheLife("hours");
  cacheTag("prestasi");
  return client.fetch<{
    total: number;
    years: number[];
    fields: string[];
    categories: string[];
  }>(groq`{
    "total": count(*[_type == "prestasi"]),
    "years": array::unique(*[_type == "prestasi" && defined(year)].year),
    "fields": array::unique(*[_type == "prestasi" && defined(field)].field),
    "categories": array::unique(*[_type == "prestasi" && defined(category)].category)
  }`);
}

/** Homepage picks first (in editor order), then the latest achievements fill the remaining slots. */
export async function getBerandaPrestasi(): Promise<SanityPrestasi[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("prestasi", "homePage");

  const { picked, latest } = await client.fetch<{
    picked: Array<SanityPrestasi | null> | null;
    latest: SanityPrestasi[];
  }>(
    groq`{
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanPrestasi[0...10]-> ${prestasiProjection},
      "latest": *[_type == "prestasi"] | order(year desc, _createdAt desc) [0...$limit] ${prestasiProjection}
    }`,
    { limit: HOME_ACHIEVEMENT_LIMIT * 2 },
  );

  const items: SanityPrestasi[] = [];
  for (const item of [...(picked ?? []), ...latest]) {
    if (item && !items.some(({ _id }) => _id === item._id)) items.push(item);
  }
  return items.slice(0, HOME_ACHIEVEMENT_LIMIT);
}
