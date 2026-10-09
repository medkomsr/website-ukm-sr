"use server";

import { client } from "@/sanity/client";
import type { SanitySiteSettings } from "@/sanity/types";
import { cacheLife, cacheTag } from "next/cache";

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("siteSettings", "kabinet");
  // Cabinet identity lives in its own document; merged here so existing consumers stay unchanged.
  return client.fetch(
    `{
      ...*[_type == "siteSettings"][0]{
        namaOrg, tagline, tahunBerdiri,
        jumlahAnggota, jumlahPenghargaan, jumlahKegiatan,
        alamat, telepon, email,
        instagram, instagramUrl,
        youtube, youtubeUrl,
        facebook, facebookUrl
      },
      ...*[_type == "kabinet" && _id == "kabinet"][0]{
        "kabinetNama": nama,
        "kabinetLogoUrl": logo.asset->url
      }
    }`,
  );
}
