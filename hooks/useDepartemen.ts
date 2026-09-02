// hooks/useDepartemen.ts
import { useQuery } from '@tanstack/react-query';
import { 
  getAllDepartemen, 
  getDepartemenBySlug 
} from '@/sanity/queries/departemen';
import type { SanityDepartemenCard, SanityDepartemenDetail } from '@/sanity/types';

// Get all departemen
export function useDepartemen() {
  return useQuery<SanityDepartemenCard[]>({
    queryKey: ['departemen'],
    queryFn: getAllDepartemen,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

// Get single departemen by slug
export function useDepartemenBySlug(slug: string) {
  return useQuery<SanityDepartemenDetail | null>({
    queryKey: ['departemen', slug],
    queryFn: () => getDepartemenBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
