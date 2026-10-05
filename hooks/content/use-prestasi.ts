import { useQuery } from "@tanstack/react-query";
import { getAllPrestasi } from "@/sanity/queries/prestasi";
import type { SanityPrestasi } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function usePrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ["prestasi"],
    queryFn: getAllPrestasi,
    staleTime: CONTENT_STALE_TIME,
  });
}
