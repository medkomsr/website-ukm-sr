// hooks/useGaleri.ts
import { useQuery } from '@tanstack/react-query';
import { getAllGaleri } from '@/sanity/queries/galeri';
import type { SanityGalleryItem } from '@/sanity/types';

export function useGaleri() {
  return useQuery<SanityGalleryItem[]>({
    queryKey: ['galeri'],
    queryFn: getAllGaleri,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
