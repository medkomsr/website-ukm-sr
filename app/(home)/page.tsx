import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/(home)/components/hero";
import AboutSection from "@/app/(home)/components/about";
import DivisionsSection from "@/app/(home)/components/divisions";
import ActivitiesSection from "@/app/(home)/components/activities-preview";
import GallerySection from "@/app/(home)/components/gallery-preview";
import NewsSection from "@/app/(home)/components/news-preview";
import { getAllAktivitas } from "@/sanity/queries/aktivitas";
import { getAllGaleri } from "@/sanity/queries/galeri";
import { getHomePage } from "@/sanity/queries/homePage";
import { getAllDivisi } from "@/sanity/queries/divisi";
import { getSiteSettings } from "@/sanity/queries/siteSettings";

export default async function Home() {
  const [allAktivitas, galleryItems, home, divisi, settings] = await Promise.all([
    getAllAktivitas(),
    getAllGaleri(),
    getHomePage(),
    getAllDivisi(),
    getSiteSettings(),
  ]);

  const events = allAktivitas.filter((a) => a.type === "event");
  const articles = allAktivitas.filter((a) => a.type === "article");

  return (
    <SiteLayout>
      <HeroSection home={home} settings={settings} />
      <AboutSection home={home} settings={settings} />
      <DivisionsSection items={divisi} home={home} />
      <ActivitiesSection items={events} />
      <GallerySection items={galleryItems} />
      <NewsSection items={articles} />
    </SiteLayout>
  );
}
