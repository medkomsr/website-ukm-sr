"use server";

import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { client } from "../client"
import type { SanityVisiMisi } from "../types"

export async function getVisiMisi(): Promise<SanityVisiMisi | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("visiMisi")
  return client.fetch(`*[_type == "visiMisi"][0]{ visi, misi }`)
}
