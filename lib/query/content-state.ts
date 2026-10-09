import "server-only";

import { dehydrate, QueryClient } from "@tanstack/react-query";
import { cacheLife } from "next/cache";
import { getHomePage } from "@/sanity/queries/homePage";
import { getSiteSettings } from "@/sanity/queries/siteSettings";
import { getVisiMisi } from "@/sanity/queries/visiMisi";
import { getAllDepartemen, getDepartemenBySlug } from "@/sanity/queries/departemen";
import { getAllBidang, getBidangBySlug } from "@/sanity/queries/bidang";
import {
  getAktivitasBySlug,
  getAktivitasMeta,
  getAktivitasPage,
  getBerandaAktivitas,
} from "@/sanity/queries/aktivitas";
import { getBerandaPrestasi, getPrestasiMeta, getPrestasiPage } from "@/sanity/queries/prestasi";
import { getAllFaq } from "@/sanity/queries/faq";
import { getAllGaleri } from "@/sanity/queries/galeri";
import { CONTENT_STALE_TIME } from "./constants";
import { seedArchive } from "./seed-archive";

export type ContentPage =
  | "home"
  | "about"
  | "department"
  | "field"
  | "activities"
  | "story"
  | "achievements"
  | "contact"
  | "gallery";

export async function getContentState(page: ContentPage, slug = "") {
  "use cache";
  cacheLife("hours");
  // Nested CMS caches propagate their invalidation tags to this public payload.
  // A fresh client per payload keeps server renders isolated from one another.
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: CONTENT_STALE_TIME, retry: false } },
  });
  const fetch = <T>(queryKey: readonly unknown[], queryFn: () => Promise<T>) =>
    client.fetchQuery({ queryKey, queryFn });
  const requests: Promise<unknown>[] = [];
  switch (page) {
    case "home":
      requests.push(
        fetch(["homePage"], getHomePage),
        fetch(["aktivitas", "home"], getBerandaAktivitas),
        fetch(["prestasi", "home"], getBerandaPrestasi),
      );
      break;
    case "about":
      requests.push(
        fetch(["visiMisi"], getVisiMisi),
        fetch(["departemen"], getAllDepartemen),
        fetch(["bidang"], getAllBidang),
        fetch(["siteSettings"], getSiteSettings),
      );
      break;
    case "department":
      requests.push(
        fetch(["departemen", slug], () => getDepartemenBySlug(slug)),
        fetch(["siteSettings"], getSiteSettings),
      );
      break;
    case "field":
      requests.push(
        fetch(["bidang", slug], () => getBidangBySlug(slug)),
        fetch(["siteSettings"], getSiteSettings),
      );
      break;
    case "story":
      requests.push(fetch(["aktivitas", slug], () => getAktivitasBySlug(slug)));
      break;
    case "activities": {
      const filters = {
        page: 1,
        types: ["article", "event"],
        category: "all",
        status: "all",
        search: "",
      };
      requests.push(
        fetch(["aktivitas", "meta"], getAktivitasMeta),
        getAktivitasPage(filters).then((data) => seedArchive(client, "aktivitas", filters, data)),
      );
      break;
    }
    case "achievements": {
      const filters = { year: "all", field: "all", category: "all", search: "", page: 1 };
      requests.push(
        fetch(["prestasi", "meta"], getPrestasiMeta),
        getPrestasiPage(filters).then((data) => seedArchive(client, "prestasi", filters, data)),
      );
      break;
    }
    case "contact":
      requests.push(fetch(["faq"], getAllFaq));
      break;
    case "gallery":
      requests.push(fetch(["galeri"], getAllGaleri));
      break;
  }
  await Promise.all(requests);
  return dehydrate(client);
}
