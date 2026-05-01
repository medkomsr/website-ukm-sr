import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/aktivitas/components/header";
import ActivityCard from "@/app/aktivitas/components/activity-card";
import ItemsGridSection from "@/app/aktivitas/components/items-grid";

export default function AktivitasPage() {
  return (
    <SiteLayout>
      {/* Header */}
      <HeaderSection />

      {/* Filter bar & Items grid*/}
      <ItemsGridSection />
    </SiteLayout>
  );
}
