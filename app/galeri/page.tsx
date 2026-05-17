import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/galeri/components/header";
import GalleryWrapper from "@/app/galeri/components/gallery-wrapper";
import { getAllGaleri } from "@/sanity/queries/galeri";

export default async function GaleriPage() {
  const items = await getAllGaleri();

  return (
    <SiteLayout>
      <HeaderSection />
      <GalleryWrapper items={items} />
    </SiteLayout>
  );
}
