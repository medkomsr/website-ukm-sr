"use server";

import { client } from "@/sanity/client";
import type { SanityHomePage } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";
import { HOME_PAGE_SELECTOR } from "./selectors";

export async function getHomePage(): Promise<SanityHomePage | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("homePage");
  return client.fetch(
    `${HOME_PAGE_SELECTOR}{
      "companyVideoUrl": coalesce(companyVideoFile.asset->url, companyVideoUrl),
      "companyVideoPosterUrl": companyVideoPoster.asset->url
    }`,
  );
}
