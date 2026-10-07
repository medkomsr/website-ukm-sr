import SiteLayout from "@/components/layout/site-layout";
import HeaderSection from "@/features/gallery/components/header";
import GalleryWrapper from "@/features/gallery/components/gallery-wrapper";

export default function GaleriPage() {
  return (
    <SiteLayout>
      {/* Header */}
      <HeaderSection />

      {/* Gallery Wrapper */}
      <GalleryWrapper />
    </SiteLayout>
  );
}
