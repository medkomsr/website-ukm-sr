"use server";

import { achievementContent, achievementMeta, listOf } from "../read-validation";
import { achievementFilter } from "@/sanity/queries/archive-filters";
import { getValidArchiveIds } from "./archive-index";
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
  const params = { ...archiveParams(input), validIds: await getValidArchiveIds("prestasi") };
  const total = await client.fetch<number>(
    `count(*[${achievementFilter} && _id in $validIds])`,
    params,
  );
  return fetchArchivePage(
    total,
    params.page,
    (start, end) =>
      client
        .fetch<SanityPrestasi[]>(
          `*[${achievementFilter} && _id in $validIds] | order(year desc, _createdAt desc, _id asc) [$start...$end] ${prestasiProjection}`,
          { ...params, start, end },
        )
        .then((value) => listOf(achievementContent).parse(value)),
    params.pageSize,
  );
}

export async function getPrestasiMeta() {
  "use cache";
  cacheLife("hours");
  cacheTag("prestasi");
  const validIds = await getValidArchiveIds("prestasi");
  const result = await client.fetch<{
    total: number;
    years: number[];
    fields: string[];
    categories: string[];
  }>(
    groq`{
    "total": count(*[_type == "prestasi" && _id in $validIds]),
    "years": array::unique(*[_type == "prestasi" && _id in $validIds && defined(year)].year),
    "fields": array::unique(*[_type == "prestasi" && _id in $validIds && defined(field)].field),
    "categories": array::unique(*[_type == "prestasi" && _id in $validIds && defined(category)].category)
  }`,
    { validIds },
  );
  return achievementMeta.parse(result ?? {});
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
      "latest": *[_type == "prestasi" && _id in $validIds] | order(year desc, _createdAt desc) [0...$limit] ${prestasiProjection}
    }`,
    { limit: HOME_ACHIEVEMENT_LIMIT * 2, validIds: await getValidArchiveIds("prestasi") },
  );

  const items: SanityPrestasi[] = [];
  for (const item of [...(picked ?? []), ...latest]) {
    if (item && !items.some(({ _id }) => _id === item._id)) items.push(item);
  }
  return listOf(achievementContent).parse(items).slice(0, HOME_ACHIEVEMENT_LIMIT);
}
