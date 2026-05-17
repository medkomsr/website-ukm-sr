"use cache"

import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { client } from "../client"
import type { SanityHomePage } from "../types"

export async function getHomePage(): Promise<SanityHomePage | null> {
  cacheLife("hours")
  cacheTag("homePage")
  return client.fetch(
    `*[_type == "homePage"][0]{
      hero{ judul1, judulHighlight, judul2, deskripsi, ctaText },
      about{ judul1, judulHighlight, deskripsi1, deskripsi2, highlights },
      divisions{ heading, subheading }
    }`
  )
}
