"use server";

import { groq } from "next-sanity"
import { client } from "../client"
import { cacheLife, cacheTag } from "next/cache"
import type { SanityPrestasi } from "../types"

export async function getAllPrestasi(): Promise<SanityPrestasi[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("prestasi")

  return client.fetch(
    groq`*[_type == "prestasi"] | order(year desc, order asc) {
      _id,
      title,
      description,
      year,
      category,
      level,
      position,
      organizer,
      location,
      featured,
      order
    }`
  )
}

export async function getFeaturedPrestasi(): Promise<SanityPrestasi[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("prestasi")

  return client.fetch(
    groq`*[_type == "prestasi" && featured == true] | order(year desc) {
      _id,
      title,
      description,
      year,
      category,
      level,
      position,
      organizer,
      location,
      featured,
      order
    }`
  )
}

export async function getPrestasiByYear(year: number): Promise<SanityPrestasi[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("prestasi", `prestasi-${year}`)

  return client.fetch(
    groq`*[_type == "prestasi" && year == $year] | order(order asc) {
      _id,
      title,
      description,
      year,
      category,
      level,
      position,
      organizer,
      location,
      featured,
      order
    }`,
    { year }
  )
}
