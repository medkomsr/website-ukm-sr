import { groq } from "next-sanity"
import { cacheLife, cacheTag } from "next/cache"
import { client } from "../client"
import type {
  SanityKaligrafiCatalogMeta,
  SanityKaligrafiCatalogPage,
  SanityKaligrafiItem,
} from "../types"

export const KALIGRAFI_PAGE_SIZE = 12

const availableItemFilter = groq`
  _type == "kaligrafiItem" &&
  status == "available" &&
  (!defined($categorySlug) || category->slug.current == $categorySlug)
`

const categoryProjection = groq`{
  _id,
  name,
  "slug": slug.current,
  displayOrder
}`

const itemProjection = groq`{
  _id,
  title,
  code,
  image,
  alt,
  "category": category->${categoryProjection},
  price,
  description,
  status,
  soldAt,
  displayOrder,
  "imageLqip": image.asset->metadata.lqip,
  "imageDimensions": image.asset->metadata.dimensions
}`

type KaligrafiPageQueryResult = {
  items: SanityKaligrafiItem[]
  total: number
}

export async function getKaligrafiPage(
  page: number,
  categorySlug?: string
): Promise<SanityKaligrafiCatalogPage> {
  "use cache"
  cacheLife("hours")
  cacheTag("kaligrafi")

  const normalizedPage = Number.isSafeInteger(page) && page > 0 ? page : 1
  const normalizedCategorySlug = categorySlug?.trim() || null

  if (normalizedCategorySlug) {
    cacheTag(`kaligrafi-category-${normalizedCategorySlug}`)
  }

  const start = (normalizedPage - 1) * KALIGRAFI_PAGE_SIZE
  const end = start + KALIGRAFI_PAGE_SIZE
  const result = await client.fetch<KaligrafiPageQueryResult>(
    groq`{
      "items": *[${availableItemFilter}]
        | order(displayOrder asc, _createdAt desc, _id asc)
        [${start}...${end}] ${itemProjection},
      "total": count(*[${availableItemFilter}])
    }`,
    {
      categorySlug: normalizedCategorySlug,
    }
  )

  return {
    items: result.items,
    total: result.total,
    page: normalizedPage,
    pageSize: KALIGRAFI_PAGE_SIZE,
    totalPages: Math.ceil(result.total / KALIGRAFI_PAGE_SIZE),
  }
}

export async function getKaligrafiCatalogMeta(): Promise<SanityKaligrafiCatalogMeta> {
  "use cache"
  cacheLife("hours")
  cacheTag("kaligrafi", "kaligrafi-meta")

  return client.fetch<SanityKaligrafiCatalogMeta>(groq`{
    "categories": *[_type == "kaligrafiCategory"]
      | order(displayOrder asc, name asc, _id asc) ${categoryProjection},
    "whatsappNumber": *[
      _type == "kaligrafiSettings" &&
      _id == "kaligrafiSettings"
    ][0].whatsappNumber
  }`)
}
