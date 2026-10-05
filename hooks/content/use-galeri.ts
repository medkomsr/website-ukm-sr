import { useQuery } from "@tanstack/react-query";
import { getAllGaleri } from "@/sanity/queries/galeri";
import type { SanityGalleryItem } from "@/sanity/types";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

export function useGaleri() {
  return useQuery<SanityGalleryItem[]>({
    queryKey: ["galeri"],
    queryFn: getAllGaleri,
    staleTime: CONTENT_STALE_TIME,
  });
}
