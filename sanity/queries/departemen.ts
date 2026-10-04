"use server";

import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityDepartemenCard, SanityDepartemenDetail } from "../types"

export async function getAllDepartemen(): Promise<SanityDepartemenCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("departemen")

  return client.fetch(
    groq`*[_type == "departemen" && coalesce(active, true)] | order(order asc) {
      _id,
      "slug": slug.current,
      heading,
      abbr,
      fullName,
      "imageUrl": image.asset->url,
      overlay
    }`
  )
}

export async function getDepartemenBySlug(slug: string): Promise<SanityDepartemenDetail | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("departemen", `departemen-${slug}`)

  return client.fetch(
    groq`*[_type == "departemen" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      heading,
      abbr,
      fullName,
      "imageUrl": image.asset->url,
      overlay,
      description,
      programs,
      programDescriptions,
      "programImages": programImages[].asset->url,
      kepala { ..., "imageUrl": image.asset->url },
      divisi[] { ..., kepala { ..., "imageUrl": image.asset->url }, staff[] { ..., "imageUrl": image.asset->url } }
    }`,
    { slug }
  )
}
