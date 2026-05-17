import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityGalleryItem } from "../types"

export async function getAllGaleri(): Promise<SanityGalleryItem[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("galeri")

  return client.fetch(
    groq`*[_type == "galeri"] | order(order asc, _createdAt desc) {
      _id,
      "imageUrl": image.asset->url,
      caption,
      alt,
      category
    }`
  )
}
