import { useResponsiveArchive } from "@/hooks/content/use-responsive-archive";
import { fetchArchive } from "@/lib/content/archive-client";
import type { ArchiveFilters, ArchivePage } from "@/lib/content/pagination";
import type { getPrestasiMeta } from "@/sanity/queries/prestasi";
import { useQuery } from "@tanstack/react-query";
import type { SanityPrestasi } from "@/sanity/types";
import { CONTENT_OBSERVER_STALE_TIME } from "@/lib/query/constants";

export function usePrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ["prestasi", "home"],
    queryFn: ({ signal }) => fetchArchive<SanityPrestasi[]>("prestasi", { view: "home" }, signal),
    staleTime: CONTENT_OBSERVER_STALE_TIME,
  });
}

function fetchPage(filters: ArchiveFilters, signal?: AbortSignal) {
  return fetchArchive<ArchivePage<SanityPrestasi>>("prestasi", filters, signal);
}

export function usePrestasiPage(filters: ArchiveFilters, mobile = false) {
  return useResponsiveArchive("prestasi", fetchPage, filters, mobile);
}
export function usePrestasiMeta(enabled = true) {
  return useQuery({
    queryKey: ["prestasi", "meta"],
    queryFn: ({ signal }) =>
      fetchArchive<Awaited<ReturnType<typeof getPrestasiMeta>>>(
        "prestasi",
        { view: "meta" },
        signal,
      ),
    staleTime: CONTENT_OBSERVER_STALE_TIME,
    enabled,
  });
}
