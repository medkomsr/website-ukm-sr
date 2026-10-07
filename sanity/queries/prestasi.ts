"use server";

import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import type { SanityPrestasi } from "@/sanity/types";

const HOME_ACHIEVEMENT_LIMIT = 3;

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

export async function getAllPrestasi(): Promise<SanityPrestasi[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("prestasi");

  return client.fetch(
    groq`*[_type == "prestasi"] | order(year desc, _createdAt desc) ${prestasiProjection}`,
  );
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
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanPrestasi[]-> ${prestasiProjection},
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
