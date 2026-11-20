"use server";

import { departmentContent, profileCard, listOf, readOne, isSafeSlug } from "../read-validation";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import type { SanityDepartemenCard, SanityDepartemenDetail } from "@/sanity/types";

export async function getAllDepartemen(): Promise<SanityDepartemenCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("departemen");

  return listOf(profileCard).parse(
    await client.fetch(
      groq`*[_type == "departemen" && defined(slug.current) && defined(abbr)] | order(_createdAt asc) {
      _id,
      "slug": slug.current,
      abbr,
      fullName,
      "imageUrl": image.asset->url
    }`,
    ),
  );
}

// Program and member lists are mapped to the shape the profile page already renders.
export async function getDepartemenBySlug(slug: string): Promise<SanityDepartemenDetail | null> {
  "use cache";
  cacheLife("hours");
  if (!isSafeSlug(slug)) return null;
  cacheTag("departemen", `departemen-${slug}`);

  return readOne(
    departmentContent,
    await client.fetch(
      groq`*[_type == "departemen" && slug.current == $slug && defined(abbr)][0] {
      _id,
      "slug": slug.current,
      abbr,
      fullName,
      "programs": programKerja[]{ "v": coalesce(nama, "") }.v,
      "programDescriptions": programKerja[]{ "v": coalesce(detail, "") }.v,
      "programImages": programKerja[]{ "v": coalesce(foto.asset->url, "") }.v,
      "divisi": [{
        "name": "Pengurus",
        "staff": pengurus[]{ "name": nama, "role": jabatan, "imageUrl": foto.asset->url }
      }]
    }`,
      { slug },
    ),
  );
}
