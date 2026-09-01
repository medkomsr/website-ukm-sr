import SiteLayout from "@/components/site-layout";
import CatalogHeader from "./_components/catalog-header";
import CatalogSkeleton from "./_components/catalog-skeleton";

export default function Loading() {
  return (
    <SiteLayout>
      <CatalogHeader />
      <CatalogSkeleton />
    </SiteLayout>
  );
}
