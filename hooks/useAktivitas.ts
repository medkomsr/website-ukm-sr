// hooks/useAktivitas.ts
import { useQuery } from '@tanstack/react-query';
import { 
  getAllAktivitas, 
  getAktivitasBySlug, 
  getRelatedAktivitas 
} from '@/sanity/queries/aktivitas';
import type { SanityActivity } from '@/sanity/types';

// Get all aktivitas
export function useAktivitas() {
  return useQuery<SanityActivity[]>({
    queryKey: ['aktivitas'],
    queryFn: getAllAktivitas,
    staleTime: 60 * 60 * 1000, // 1 jam (sesuai cache di query)
  });
}

// Get single aktivitas by slug
export function useAktivitasBySlug(slug: string) {
  return useQuery<SanityActivity | null>({
    queryKey: ['aktivitas', slug],
    queryFn: () => getAktivitasBySlug(slug),
    enabled: !!slug, // Only run jika slug ada
    staleTime: 60 * 60 * 1000,
  });
}

// Get related aktivitas
export function useRelatedAktivitas(slug: string, category: string) {
  return useQuery<SanityActivity[]>({
    queryKey: ['aktivitas', 'related', slug, category],
    queryFn: () => getRelatedAktivitas(slug, category),
    enabled: !!slug && !!category,
    staleTime: 60 * 60 * 1000,
  });
}