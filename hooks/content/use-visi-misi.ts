import { useQuery } from "@tanstack/react-query";
import { getVisiMisi } from "@/sanity/queries/visiMisi";
import type { SanityVisiMisi } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useVisiMisi() {
  return useQuery<SanityVisiMisi | null>({
    queryKey: ["visiMisi"],
    queryFn: getVisiMisi,
    staleTime: CONTENT_STALE_TIME,
  });
}
