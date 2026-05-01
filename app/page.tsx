import SiteLayout from "@/components/site-layout";
import HeroSection from "@/components/home/hero";
import AboutSection from "@/components/home/about";
import DivisionsSection from "@/components/home/divisions";
import ActivitiesSection from "@/components/home/activities-preview";
import GallerySection from "@/components/home/gallery-preview";
import NewsSection from "@/components/home/news-preview";
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
