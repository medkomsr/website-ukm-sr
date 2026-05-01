import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/(home)/components/hero";
import AboutSection from "@/app/(home)/components/about";
import DivisionsSection from "@/app/(home)/components/divisions";
import ActivitiesSection from "@/app/(home)/components/activities-preview";
import GallerySection from "@/app/(home)/components/gallery-preview";
import NewsSection from "@/app/(home)/components/news-preview";
export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <AboutSection />
      <DivisionsSection />
      <ActivitiesSection />
      <GallerySection />
      <NewsSection />
    </SiteLayout>
  );
}
