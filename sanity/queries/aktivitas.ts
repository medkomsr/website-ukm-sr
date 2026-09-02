"use server"

import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityActivity } from "../types"
import {compareActivityDatesDesc, normalizeSanityActivityType, type SanityActivityTypeInput} from "../../lib/activity-normalization"

type FetchedActivity = Omit<SanityActivity, "type"> & {type: SanityActivityTypeInput}

function normalizeActivity(activity: FetchedActivity): SanityActivity {
  return {...activity, type: normalizeSanityActivityType(activity.type)}
}

const activityProjection = groq`{
  _id,
  "slug": slug.current,
  "type": select(_type == "artikel" => "article", "event"),
  title,
  "description": select(
    _type == "event" && defined(longDescription) && longDescription != "" => longDescription,
    description
  ),
  "imageUrl": image.asset->url,
  category,
  date,
  endDate,
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

  const activities = await client.fetch<FetchedActivity[]>(
    groq`*[_type == "event" || _type == "artikel"] ${activityProjection}`
  )

  return activities.map(normalizeActivity).sort(compareActivityDatesDesc)
}

export async function getAktivitasBySlug(slug: string): Promise<SanityActivity | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("aktivitas", `aktivitas-${slug}`)

  const activity = await client.fetch<FetchedActivity | null>(
    groq`*[(_type == "event" || _type == "artikel") && slug.current == $slug][0] ${activityProjection}`,
    { slug }
  )

  return activity ? normalizeActivity(activity) : null
}

export async function getRelatedAktivitas(slug: string, category: string): Promise<SanityActivity[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("aktivitas")

  const activities = await client.fetch<FetchedActivity[]>(
    groq`*[(_type == "event" || _type == "artikel") && slug.current != $slug && category == $category] ${activityProjection}`,
    { slug, category }
  )

  return activities.map(normalizeActivity).sort(compareActivityDatesDesc).slice(0, 3)
}
