import { useQuery } from "@tanstack/react-query";
import { getAllPrestasi, getBerandaPrestasi } from "@/sanity/queries/prestasi";
import type { SanityPrestasi } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function usePrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ["prestasi"],
    queryFn: getAllPrestasi,
    staleTime: CONTENT_STALE_TIME,
  });
}

// Homepage selection: editor picks first, then the latest achievements (max 3)
export function useBerandaPrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ["prestasi-beranda"],
    queryFn: getBerandaPrestasi,
    staleTime: CONTENT_STALE_TIME,
  });
}
