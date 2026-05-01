import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/galeri/components/header";
import GalleryWrapper from "@/app/galeri/components/gallery-wrapper";
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
