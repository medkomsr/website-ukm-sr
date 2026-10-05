import SiteLayout from "@/components/layout/site-layout";
import CatalogHeader from "@/features/catalog/components/catalog-header";
import CatalogSkeleton from "@/features/catalog/components/catalog-skeleton";

export default function Loading() {
  return (
    <SiteLayout>
      <CatalogHeader />
      <CatalogSkeleton />
    </SiteLayout>
  );
}
