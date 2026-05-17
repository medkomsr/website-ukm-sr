import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/aktivitas/components/header";
import ItemsGridSection from "@/app/aktivitas/components/items-grid";
import { getAllAktivitas } from "@/sanity/queries/aktivitas";

export default async function AktivitasPage() {
  const items = await getAllAktivitas();

  return (
    <SiteLayout>
      <HeaderSection />
      <ItemsGridSection items={items} />
    </SiteLayout>
  );
}
