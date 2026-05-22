// hooks/usePrestasi.ts
import { useQuery } from '@tanstack/react-query';
import { getAllPrestasi, getFeaturedPrestasi, getPrestasiByYear } from '@/sanity/queries/prestasi';
import type { SanityPrestasi } from '@/sanity/types';

export function usePrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ['prestasi'],
    queryFn: getAllPrestasi,
    staleTime: 60 * 60 * 1000,
  });
}

export function useFeaturedPrestasi() {
  return useQuery<SanityPrestasi[]>({
    queryKey: ['prestasi', 'featured'],
    queryFn: getFeaturedPrestasi,
    staleTime: 60 * 60 * 1000,
  });
}

export function usePrestasiByYear(year: number) {
  return useQuery<SanityPrestasi[]>({
    queryKey: ['prestasi', year],
    queryFn: () => getPrestasiByYear(year),
    staleTime: 60 * 60 * 1000,
    enabled: !!year,
  });
}
