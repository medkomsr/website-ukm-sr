"use server";

import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { client } from "../client"
import type { SanityFaq } from "../types"

export async function getAllFaq(): Promise<SanityFaq[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("faq")
  return client.fetch(
    `*[_type == "faq"] | order(urutan asc){ _id, pertanyaan, jawaban }`
  )
}
