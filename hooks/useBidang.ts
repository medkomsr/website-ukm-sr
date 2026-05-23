// hooks/useBidang.ts
import { useQuery } from '@tanstack/react-query';
import { getAllBidang, getBidangBySlug } from '@/sanity/queries/bidang';
import type { SanityBidang } from '@/sanity/types';

export function useBidang() {
  return useQuery<SanityBidang[]>({
    queryKey: ['bidang'],
    queryFn: getAllBidang,
    staleTime: 60 * 60 * 1000,
  });
}

export function useBidangBySlug(slug: string) {
  return useQuery<SanityBidang | null>({
    queryKey: ['bidang', slug],
    queryFn: () => getBidangBySlug(slug),
    staleTime: 60 * 60 * 1000,
    enabled: !!slug,
  });
}
