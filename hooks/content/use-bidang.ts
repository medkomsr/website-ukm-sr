import { useQuery } from "@tanstack/react-query";
import { getAllBidang, getBidangBySlug } from "@/sanity/queries/bidang";
import type { SanityBidang } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useBidang() {
  return useQuery<SanityBidang[]>({
    queryKey: ["bidang"],
    queryFn: getAllBidang,
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useBidangBySlug(slug: string) {
  return useQuery<SanityBidang | null>({
    queryKey: ["bidang", slug],
    queryFn: () => getBidangBySlug(slug),
    staleTime: CONTENT_STALE_TIME,
    enabled: !!slug,
  });
}
