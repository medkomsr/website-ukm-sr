import { useQuery } from "@tanstack/react-query";
import { getAktivitasBySlug, getAllAktivitas } from "@/sanity/queries/aktivitas";
import type { SanityActivity } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

// Get all aktivitas
export function useAktivitas() {
  return useQuery<SanityActivity[]>({
    queryKey: ["aktivitas"],
    queryFn: getAllAktivitas,
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
