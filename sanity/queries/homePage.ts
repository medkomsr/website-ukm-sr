"use server";

import { cacheLife, cacheTag } from "next/cache"
import { client } from "../client"
import type { SanityHomePage } from "../types"

export async function getHomePage(): Promise<SanityHomePage | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("homePage", "bidang")
  return client.fetch(
    `*[_type == "homePage"][0]{
      hero{ judul1, judulHighlight, judul2, deskripsi, ctaText },
      about{ judul1, judulHighlight, deskripsi1, deskripsi2, highlights },
      divisions{ heading, subheading },
      "featuredBidang": featuredBidang[]->{
        _id,
        "slug": slug.current,
        heading,
        abbr,
        fullName,
        "imageUrl": image.asset->url,
        overlayTheme,
        description,
        order
      }
    }`
  )
}
