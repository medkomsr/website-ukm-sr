"use server";

import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import type { SanityPrestasi } from "@/sanity/types";

export async function getAllPrestasi(): Promise<SanityPrestasi[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("prestasi");

  return client.fetch(
    groq`*[_type == "prestasi"] | order(year desc, order asc) {
      _id,
      field,
      "articleSlug": article->slug.current,
      "participants": participants[]{ _key, name, faculty, quote, "imageUrl": image.asset->url },
      title,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      description,
      year,
      category,
      level,
      position,
      organizer,
      location,
      featured,
      order
    }`,
  );
}
