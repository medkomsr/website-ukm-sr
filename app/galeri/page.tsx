import { Suspense } from "react";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import SiteLayout from "@/components/layout/site-layout";
import HeaderSection from "@/features/gallery/components/header";
import GalleryWrapper from "@/features/gallery/components/gallery-wrapper";

export default function GaleriPage() {
  return (
    <SiteLayout>
      {/* Header */}
      <HeaderSection />

      {/* Gallery Wrapper */}
      <Suspense fallback={<ContentSkeleton compact />}>
        <ContentData page="gallery">
          <GalleryWrapper />
        </ContentData>
      </Suspense>
    </SiteLayout>
  );
}
