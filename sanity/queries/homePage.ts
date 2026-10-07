"use server";

import { client } from "@/sanity/client";
import type { SanityHomePage } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";

export async function getHomePage(): Promise<SanityHomePage | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("homePage");
  return client.fetch(
    `*[_type == "homePage"][0]{
      "companyVideoUrl": coalesce(companyVideoFile.asset->url, companyVideoUrl),
      "companyVideoPosterUrl": companyVideoPoster.asset->url
    }`,
  );
}
