"use server";

import { faqContent, listOf } from "../read-validation";
import { client } from "@/sanity/client";
import type { SanityFaq } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllFaq(): Promise<SanityFaq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faq");
  return listOf(faqContent).parse(
    await client.fetch(
      `coalesce(*[_type == "faq" && _id == "faq"][0].items[]{ "_id": _key, pertanyaan, jawaban }, [])`,
    ),
  );
}
