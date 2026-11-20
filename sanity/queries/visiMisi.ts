"use server";

import { visionContent, readOne } from "../read-validation";
import { client } from "@/sanity/client";
import type { SanityVisiMisi } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";
import { VISI_MISI_SELECTOR } from "./selectors";

export async function getVisiMisi(): Promise<SanityVisiMisi | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("visiMisi");
  return readOne(visionContent, await client.fetch(`${VISI_MISI_SELECTOR}{ visi, misi }`));
}
