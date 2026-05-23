// hooks/useFaq.ts
import { useQuery } from '@tanstack/react-query';
import { getAllFaq } from '@/sanity/queries/faq';
import type { SanityFaq } from '@/sanity/types';

export function useFaq() {
  return useQuery<SanityFaq[]>({
    queryKey: ['faq'],
    queryFn: getAllFaq,
    staleTime: 60 * 60 * 1000,
  });
}