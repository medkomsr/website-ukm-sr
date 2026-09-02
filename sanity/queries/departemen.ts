"use server";

import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityDepartemenCard, SanityDepartemenDetail, SanityProgramItem } from "../types"
import {mergeProgramItems} from "../../lib/program-items"

type LegacyDepartemenDetail = Omit<SanityDepartemenDetail, "programItems"> & {
  programItems?: SanityProgramItem[]
  programs?: string[]
  programDescriptions?: string[]
}

export async function getAllDepartemen(): Promise<SanityDepartemenCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("departemen")

  return client.fetch(
    groq`*[_type == "departemen"] | order(order asc) {
      _id,
      "slug": slug.current,
      heading,
      abbr,
      "imageUrl": image.asset->url,
      overlayTheme
    }`
  )
}

export async function getDepartemenBySlug(slug: string): Promise<SanityDepartemenDetail | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("departemen", `departemen-${slug}`)

  const departemen = await client.fetch<LegacyDepartemenDetail | null>(
    groq`*[_type == "departemen" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      heading,
      abbr,
      fullName,
      "imageUrl": image.asset->url,
      overlayTheme,
      description,
      programItems,
      programs,
      programDescriptions,
      kepala,
      divisi
    }`,
    { slug }
  )

  if (!departemen) return null
  const {programItems, programs, programDescriptions, ...detail} = departemen
  return {
    ...detail,
    programItems: mergeProgramItems(programItems, programs, programDescriptions),
  }
}
