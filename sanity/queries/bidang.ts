"use server";

import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import type { SanityBidang, SanityBidangCard } from "@/sanity/types";
import { BIDANG_CARDS_QUERY } from "./selectors";

const bidangProjection = groq`{
  _id,
  "slug": slug.current,
  abbr,
  fullName,
  "imageUrl": image.asset->url,
  description,
  "gallery": gallery[]{
    "imageUrl": image.asset->url,
    alt,
    caption
  },
  ketuaBidang{ name, role, "imageUrl": image.asset->url },
  wakilKetuaBidang{ name, role, "imageUrl": image.asset->url }
}`;

export async function getAllBidang(): Promise<SanityBidangCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("bidang");

  return client.fetch(BIDANG_CARDS_QUERY);
}

export async function getBidangBySlug(slug: string): Promise<SanityBidang | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("bidang", `bidang-${slug}`);

  return client.fetch(groq`*[_type == "bidang" && slug.current == $slug][0] ${bidangProjection}`, {
    slug,
  });
}
