import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityActivity } from "../types"

const activityProjection = groq`{
  _id,
  "slug": slug.current,
  "type": _type,
  title,
  description,
  longDescription,
  "imageUrl": image.asset->url,
  category,
  date,
  status,
  time,
  location,
  readTime,
  tags,
  agenda,
  organizer,
  maxParticipants,
  author,
  body
}`

export async function getAllAktivitas(): Promise<SanityActivity[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("aktivitas")

  return client.fetch(
    groq`*[_type == "event" || _type == "artikel"] | order(date desc) ${activityProjection}`
  )
}

export async function getAktivitasBySlug(slug: string): Promise<SanityActivity | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("aktivitas", `aktivitas-${slug}`)

  return client.fetch(
    groq`*[(_type == "event" || _type == "artikel") && slug.current == $slug][0] ${activityProjection}`,
    { slug }
  )
}

export async function getRelatedAktivitas(slug: string, category: string): Promise<SanityActivity[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("aktivitas")

  return client.fetch(
    groq`*[(_type == "event" || _type == "artikel") && slug.current != $slug && category == $category] | order(date desc)[0..2] ${activityProjection}`,
    { slug, category }
  )
}
