import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/prestasi/components/hero";
import StatsSection from "@/app/prestasi/components/stats";
import FeaturedSection from "@/app/prestasi/components/featured";
import TimelineSection from "@/app/prestasi/components/timeline";
import SponsorCtaSection from "@/app/prestasi/components/sponsor-cta";

export const metadata = {
  title: "Prestasi | UKM Seni Religi UB",
  description: "Rekam jejak prestasi dan penghargaan UKM Seni Religi Universitas Brawijaya dari tingkat kampus hingga nasional.",
};

export default function PrestasiPage() {
  return (
    <SiteLayout>
      <HeroSection />
      <StatsSection />
      <FeaturedSection />
      <TimelineSection />
      <SponsorCtaSection />
    </SiteLayout>
  );
}
