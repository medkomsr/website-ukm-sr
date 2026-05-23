"use server";

import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityBidang } from "../types"

export async function getAllBidang(): Promise<SanityBidang[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("bidang")

  return client.fetch(
    groq`*[_type == "bidang"] | order(order asc) {
      _id,
      "slug": slug.current,
      heading,
      abbr,
      fullName,
      "imageUrl": image.asset->url,
      overlay,
      description,
      "gallery": gallery[]{
        "imageUrl": image.asset->url,
        alt,
        caption
      },
      ketuaBidang,
      wakilKetuaBidang,
      order
    }`
  )
}

export async function getBidangBySlug(slug: string): Promise<SanityBidang | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("bidang", `bidang-${slug}`)

  return client.fetch(
    groq`*[_type == "bidang" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      heading,
      abbr,
      fullName,
      "imageUrl": image.asset->url,
      overlay,
      description,
      "gallery": gallery[]{
        "imageUrl": image.asset->url,
        alt,
        caption
      },
      ketuaBidang,
      wakilKetuaBidang,
      order
    }`,
    { slug }
  )
}
