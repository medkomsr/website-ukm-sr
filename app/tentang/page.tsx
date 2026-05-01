import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/aktivitas/components/header";
import AboutSection from "@/app/(home)/components/about";
import VisiMisiSection from "@/app/tentang/components/visi-misi";
import StrukturKepengurusanSection from "@/app/tentang/components/struktur-kepengurusan";

export default function TentangPage() {
  return (
    <SiteLayout>
      {/* Header */}
      <HeaderSection />

      {/* About */}
      <AboutSection />

      {/* Vision & Mission – Flip Cards */}
      <VisiMisiSection />

      {/* Struktur Kepengurusan */}
      <StrukturKepengurusanSection />
    </SiteLayout>
  );
}
