"use server";

import { activityFilter } from "@/sanity/queries/archive-filters";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import type { SanityActivity } from "@/sanity/types";

import { archiveParams, fetchArchivePage, type ArchiveFilters } from "@/lib/content/pagination";

const HOME_NEWS_LIMIT = 3;

// Event-only fields are dropped for "berita" so stale values never leak into the UI.
const activityProjection = groq`{
  _id,
  "slug": slug.current,
  "type": select(jenis == "acara" => "event", "article"),
  title,
  description,
  "imageUrl": image.asset->url,
  "gallery": gallery[]{ _key, "imageUrl": asset->url, alt, caption },
  category,
  date,
  "status": select(jenis == "acara" => status),
  "time": select(jenis == "acara" => time),
  "location": select(jenis == "acara" => location),
  "agenda": select(jenis == "acara" => agenda),
  tags,
  body
}`;

const dateLabel = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Sanity stores ISO dates for correct ordering; the UI keeps showing "21 Mei 2026". */
function withDateLabel(activity: SanityActivity): SanityActivity {
  const date = new Date(activity.date);
  return Number.isNaN(date.getTime()) ? activity : { ...activity, date: dateLabel.format(date) };
}

const activityCardProjection = groq`{
  _id, "slug": slug.current, "type": select(jenis == "acara" => "event", "article"),
  title, description, "imageUrl": image.asset->url, category, date,
  "status": select(jenis == "acara" => status),
  "time": select(jenis == "acara" => time), "location": select(jenis == "acara" => location)
}`;

export async function getAktivitasPage(input: ArchiveFilters = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("aktivitas");
  const params = archiveParams(input);
  const total = await client.fetch<number>(`count(*[${activityFilter}])`, params);
  return fetchArchivePage(
    total,
    params.page,
    async (start, end) => {
      const items = await client.fetch<SanityActivity[]>(
        `*[${activityFilter}] | order(date desc, _createdAt desc, _id asc) [$start...$end] ${activityCardProjection}`,
        { ...params, start, end },
      );
      return items.map(withDateLabel);
    },
    params.pageSize,
  );
}

export async function getAktivitasMeta() {
  "use cache";
  cacheLife("hours");
  cacheTag("aktivitas");
  const result = await client.fetch<{ categories: string[]; featured: SanityActivity[] }>(groq`{
    "categories": array::unique(*[_type == "beritaAcara" && defined(slug.current) && defined(category)].category),
    "featured": *[_type == "beritaAcara" && defined(slug.current)] | order(date desc, _createdAt desc, _id asc) [0...5] ${activityCardProjection}
  }`);
  return { ...result, featured: result.featured.map(withDateLabel) };
}

/** Homepage picks first (in editor order), then the latest stories fill the remaining slots. */
export async function getBerandaAktivitas(): Promise<SanityActivity[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("aktivitas", "homePage");

  const { picked, latest } = await client.fetch<{
    picked: Array<SanityActivity | null> | null;
    latest: SanityActivity[];
  }>(
    groq`{
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanBerita[0...6]-> ${activityCardProjection},
      "latest": *[_type == "beritaAcara"] | order(date desc, _createdAt desc) [0...$limit] ${activityCardProjection}
    }`,
    { limit: HOME_NEWS_LIMIT * 2 },
  );

  const items: SanityActivity[] = [];
  for (const item of [...(picked ?? []), ...latest]) {
    if (item?.slug && !items.some(({ _id }) => _id === item._id)) items.push(item);
  }
  return items.slice(0, HOME_NEWS_LIMIT).map(withDateLabel);
}

export async function getAktivitasBySlug(slug: string): Promise<SanityActivity | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("aktivitas", `aktivitas-${slug}`);

  const item = await client.fetch<SanityActivity | null>(
    groq`*[_type == "beritaAcara" && slug.current == $slug][0] ${activityProjection}`,
    { slug },
  );
  return item && withDateLabel(item);
}
