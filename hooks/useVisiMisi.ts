// hooks/useVisiMisi.ts
import { useQuery } from '@tanstack/react-query';
import { getVisiMisi } from '@/sanity/queries/visiMisi';
import type { SanityVisiMisi } from '@/sanity/types';

export function useVisiMisi() {
  return useQuery<SanityVisiMisi | null>({
    queryKey: ['visiMisi'],
    queryFn: getVisiMisi,
    staleTime: 60 * 60 * 1000,
  });
}