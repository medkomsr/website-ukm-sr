import { useQuery } from "@tanstack/react-query";
import { getHomePage } from "@/sanity/queries/homePage";
import type { SanityHomePage } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useHomePage() {
  return useQuery<SanityHomePage | null>({
    queryKey: ["homePage"],
    queryFn: getHomePage,
    staleTime: CONTENT_STALE_TIME,
  });
}
