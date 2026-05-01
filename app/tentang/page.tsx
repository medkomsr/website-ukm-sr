import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/components/aktivitas/header";
import AboutSection from "@/components/home/about";
import VisiMisiSection from "@/components/tentang/visi-misi";
import StrukturKepengurusanSection from "@/components/tentang/struktur-kepengurusan";

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
