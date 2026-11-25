import { useResponsiveArchive } from "@/hooks/content/use-responsive-archive";
import { fetchArchive } from "@/lib/content/archive-client";
import type { ArchiveFilters, ArchivePage } from "@/lib/content/pagination";
import type { getAktivitasMeta } from "@/sanity/queries/aktivitas";
import { useQuery } from "@tanstack/react-query";
import type { SanityActivity } from "@/sanity/types";
import { CONTENT_OBSERVER_STALE_TIME } from "@/lib/query/constants";

// Get all aktivitas
export function useAktivitas() {
  return useQuery<SanityActivity[]>({
    queryKey: ["aktivitas", "home"],
    queryFn: ({ signal }) => fetchArchive<SanityActivity[]>("aktivitas", { view: "home" }, signal),
    staleTime: CONTENT_OBSERVER_STALE_TIME,
  });
}

// Get single aktivitas by slug
export function useAktivitasBySlug(slug: string) {
  return useQuery<SanityActivity | null>({
    queryKey: ["aktivitas", slug],
    queryFn: ({ signal }) => fetchArchive<SanityActivity | null>("aktivitas", { slug }, signal),
    enabled: !!slug, // Only run jika slug ada
    staleTime: CONTENT_OBSERVER_STALE_TIME,
  });
}

function fetchPage(filters: ArchiveFilters, signal?: AbortSignal) {
  return fetchArchive<ArchivePage<SanityActivity>>("aktivitas", filters, signal);
}

export function useAktivitasPage(filters: ArchiveFilters, mobile = false) {
  return useResponsiveArchive("aktivitas", fetchPage, filters, mobile);
}
export function useAktivitasMeta() {
  return useQuery({
    queryKey: ["aktivitas", "meta"],
    queryFn: ({ signal }) =>
      fetchArchive<Awaited<ReturnType<typeof getAktivitasMeta>>>(
        "aktivitas",
        { view: "meta" },
        signal,
      ),
    staleTime: CONTENT_OBSERVER_STALE_TIME,
  });
}
