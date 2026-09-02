"use server";

import { cacheLife, cacheTag } from "next/cache"
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
