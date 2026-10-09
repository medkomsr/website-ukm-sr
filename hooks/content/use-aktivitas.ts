import { useResponsiveArchive } from "@/hooks/content/use-responsive-archive";
import type { ArchiveFilters } from "@/lib/content/pagination";
import { getAktivitasPage, getAktivitasMeta } from "@/sanity/queries/aktivitas";
import { useQuery } from "@tanstack/react-query";
import { getAktivitasBySlug, getBerandaAktivitas } from "@/sanity/queries/aktivitas";
import type { SanityActivity } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

// Get all aktivitas
export function useAktivitas() {
  return useQuery<SanityActivity[]>({
    queryKey: ["aktivitas", "home"],
    queryFn: getBerandaAktivitas,
    staleTime: CONTENT_STALE_TIME, // 1 jam (sesuai cache di query)
  });
}

// Get single aktivitas by slug
export function useAktivitasBySlug(slug: string) {
  return useQuery<SanityActivity | null>({
    queryKey: ["aktivitas", slug],
    queryFn: () => getAktivitasBySlug(slug),
    enabled: !!slug, // Only run jika slug ada
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useAktivitasPage(filters: ArchiveFilters, mobile = false) {
  return useResponsiveArchive("aktivitas", getAktivitasPage, filters, mobile);
}
export function useAktivitasMeta() {
  return useQuery({
    queryKey: ["aktivitas", "meta"],
    queryFn: getAktivitasMeta,
    staleTime: CONTENT_STALE_TIME,
  });
}
