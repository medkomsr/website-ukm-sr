import { useQuery } from "@tanstack/react-query";
import { getAllBidang } from "@/sanity/queries/bidang";
import { fetchArchive } from "@/lib/content/archive-client";
import type { SanityBidang, SanityBidangCard } from "@/sanity/types";
import { CONTENT_OBSERVER_STALE_TIME } from "@/lib/query/constants";

export function useBidang() {
  return useQuery<SanityBidangCard[]>({
    queryKey: ["bidang"],
    queryFn: getAllBidang,
    staleTime: CONTENT_OBSERVER_STALE_TIME,
  });
}

export function useBidangBySlug(slug: string) {
  return useQuery<SanityBidang | null>({
    queryKey: ["bidang", slug],
    queryFn: ({ signal }) => fetchArchive<SanityBidang | null>("bidang", { slug }, signal),
    staleTime: CONTENT_OBSERVER_STALE_TIME,
    enabled: !!slug,
  });
}
