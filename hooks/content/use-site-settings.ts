import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/sanity/queries/siteSettings";
import type { SanitySiteSettings } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useSiteSettings() {
  return useQuery<SanitySiteSettings | null>({
    queryKey: ["siteSettings"],
    queryFn: getSiteSettings,
    staleTime: CONTENT_STALE_TIME,
  });
}
