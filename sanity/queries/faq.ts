"use server";

import { client } from "@/sanity/client";
import type { SanityFaq } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllFaq(): Promise<SanityFaq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faq");
  return client.fetch(`*[_type == "faq"] | order(urutan asc){ _id, pertanyaan, jawaban }`);
}
