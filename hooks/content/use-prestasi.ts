import { useResponsiveArchive } from "@/hooks/content/use-responsive-archive";
import type { ArchiveFilters } from "@/lib/content/pagination";
import { getPrestasiPage, getPrestasiMeta } from "@/sanity/queries/prestasi";
import { useQuery } from "@tanstack/react-query";
import { getBerandaPrestasi } from "@/sanity/queries/prestasi";
import type { SanityPrestasi } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function usePrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ["prestasi", "home"],
    queryFn: getBerandaPrestasi,
    staleTime: CONTENT_STALE_TIME,
  });
}

export function usePrestasiPage(filters: ArchiveFilters, mobile = false) {
  return useResponsiveArchive("prestasi", getPrestasiPage, filters, mobile);
}
export function usePrestasiMeta(enabled = true) {
  return useQuery({
    queryKey: ["prestasi", "meta"],
    queryFn: getPrestasiMeta,
    staleTime: CONTENT_STALE_TIME,
    enabled,
  });
}
