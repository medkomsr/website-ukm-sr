"use server";

import { cabinetContent, readOne } from "../read-validation";
import { client } from "@/sanity/client";
import type { SanityKabinet } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";

export async function getKabinet(): Promise<SanityKabinet | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("kabinet");
  return readOne(
    cabinetContent,
    await client.fetch(
      '*[_type == "kabinet" && _id == "kabinet"][0]{nama,"logoUrl":logo.asset->url}',
    ),
  );
}
