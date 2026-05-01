import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/components/aktivitas/header";
import ActivityCard from "@/components/aktivitas/activity-card";
import ItemsGridSection from "@/components/aktivitas/items-grid";

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
