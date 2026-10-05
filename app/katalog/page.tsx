import type { Metadata } from "next";
import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import CatalogHeader from "@/features/catalog/components/catalog-header";
import CatalogSkeleton from "@/features/catalog/components/catalog-skeleton";
import CatalogContent, {
  type CatalogPageProps,
} from "@/features/catalog/components/catalog-content";

export const metadata: Metadata = {
  title: "Katalog Kaligrafi | UKM Seni Religi UB",
  description:
    "Jelajahi koleksi karya kaligrafi pilihan UKM Seni Religi Universitas Brawijaya dan hubungi kami untuk informasi pemesanan.",
  alternates: {
    canonical: "/katalog",
  },
  openGraph: {
    title: "Katalog Kaligrafi | UKM Seni Religi UB",
    description: "Koleksi karya kaligrafi pilihan dari UKM Seni Religi Universitas Brawijaya.",
    type: "website",
  },
};

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <SiteLayout>
      <CatalogHeader />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </SiteLayout>
  );
}
