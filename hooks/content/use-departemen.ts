import { useQuery } from "@tanstack/react-query";
import { getAllDepartemen, getDepartemenBySlug } from "@/sanity/queries/departemen";
import type { SanityDepartemenCard, SanityDepartemenDetail } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

// Get all departemen
export function useDepartemen() {
  return useQuery<SanityDepartemenCard[]>({
    queryKey: ["departemen"],
    queryFn: getAllDepartemen,
    staleTime: CONTENT_STALE_TIME,
  });
}

// Get single departemen by slug
export function useDepartemenBySlug(slug: string) {
  return useQuery<SanityDepartemenDetail | null>({
    queryKey: ["departemen", slug],
    queryFn: () => getDepartemenBySlug(slug),
    enabled: !!slug,
    staleTime: CONTENT_STALE_TIME,
  });
}
