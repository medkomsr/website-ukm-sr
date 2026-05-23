// hooks/useDivisi.ts
import { useQuery } from '@tanstack/react-query';
import { getAllDivisi } from '@/sanity/queries/divisi';
import type { SanityDivisi } from '@/sanity/types';

export function useDivisi() {
  return useQuery<SanityDivisi[]>({
    queryKey: ['divisi'],
    queryFn: getAllDivisi,
    staleTime: 60 * 60 * 1000,
  });
}