// hooks/useHomePage.ts
import { useQuery } from '@tanstack/react-query';
import { getHomePage } from '@/sanity/queries/homePage';
import type { SanityHomePage } from '@/sanity/types';

export function useHomePage() {
  return useQuery<SanityHomePage | null>({
    queryKey: ['homePage'],
    queryFn: getHomePage,
    staleTime: 60 * 60 * 1000,
  });
}