import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/aktivitas/components/header";
import AboutSection from "@/app/(home)/components/about";
import VisiMisiSection from "@/app/tentang/components/visi-misi";
import StrukturKepengurusanSection from "@/app/tentang/components/struktur-kepengurusan";
import { getAllDepartemen } from "@/sanity/queries/departemen";
import { getVisiMisi } from "@/sanity/queries/visiMisi";
import { getHomePage } from "@/sanity/queries/homePage";
import { getSiteSettings } from "@/sanity/queries/siteSettings";

export default async function TentangPage() {
  const [departments, visiMisi, home, settings] = await Promise.all([
    getAllDepartemen(),
    getVisiMisi(),
    getHomePage(),
    getSiteSettings(),
  ]);

  return (
    <SiteLayout>
      <HeaderSection />
      <AboutSection home={home} settings={settings} />
      <VisiMisiSection data={visiMisi} />
      <StrukturKepengurusanSection departments={departments} />
    </SiteLayout>
  );
}
