import SiteLayout from "@/components/site-layout";
import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import DivisionsSection from "@/components/sections/divisions";
import ActivitiesSection from "@/components/sections/activities-preview";
import GallerySection from "@/components/sections/gallery-preview";
import NewsSection from "@/components/sections/news-preview";
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
