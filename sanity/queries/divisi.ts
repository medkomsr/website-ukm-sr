"use server";

import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { client } from "../client"
import type { SanityDivisi } from "../types"

export async function getAllDivisi(): Promise<SanityDivisi[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("divisi")
  return client.fetch(
    `*[_type == "divisi"] | order(urutan asc){
      _id, nama, subtitle, deskripsi, jumlahAnggota, ikon, accent,
      "imageUrl": gambar.asset->url
    }`
  )
}
