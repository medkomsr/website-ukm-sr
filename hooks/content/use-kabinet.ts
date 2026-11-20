import { useQuery } from "@tanstack/react-query";
import { getKabinet } from "@/sanity/queries/kabinet";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useKabinet() {
  return useQuery({ queryKey: ["kabinet"], queryFn: getKabinet, staleTime: CONTENT_STALE_TIME });
}
