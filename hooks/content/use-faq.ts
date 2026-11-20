import { useQuery } from "@tanstack/react-query";
import { getAllFaq } from "@/sanity/queries/faq";
import type { SanityFaq } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useFaq() {
  return useQuery<SanityFaq[]>({
    queryKey: ["faq"],
    queryFn: getAllFaq,
    staleTime: CONTENT_STALE_TIME,
  });
}
