"use server";

import { client } from "@/sanity/client";
import type { SanityVisiMisi } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";

export async function getVisiMisi(): Promise<SanityVisiMisi | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("visiMisi");
  return client.fetch(`*[_type == "visiMisi"][0]{ visi, misi }`);
}
