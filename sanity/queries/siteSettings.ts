"use server";

import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { client } from "../client"
import type { SanitySiteSettings } from "../types"

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("siteSettings")
  return client.fetch(
    `*[_type == "siteSettings"][0]{
      namaOrg, tagline, tahunBerdiri,
      jumlahAnggota, jumlahPenghargaan, jumlahKegiatan,
      alamat, telepon, email,
      instagram, instagramUrl,
      youtube, youtubeUrl,
      facebook, facebookUrl
    }`
  )
}
