// hooks/useSiteSettings.ts
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '@/sanity/queries/siteSettings';
import type { SanitySiteSettings } from '@/sanity/types';

export function useSiteSettings() {
  return useQuery<SanitySiteSettings | null>({
    queryKey: ['siteSettings'],
    queryFn: getSiteSettings,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
