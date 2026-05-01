import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/components/galeri/header";
import GalleryWrapper from "@/components/galeri/gallery-wrapper";
import { allGallery } from "@/lib/data";

export default function GaleriPage() {
  return (
    <SiteLayout>
      {/* Header */}
      <HeaderSection />

      {/* Gallery Wrapper */}
      <GalleryWrapper items={allGallery} />
    </SiteLayout>
  );
}
