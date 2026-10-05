import SiteLayout from "@/components/layout/site-layout";
import type { Metadata } from "next";
import Newsroom from "@/features/activities/components/newsroom";

export const metadata: Metadata = {
  title: "Berita & Acara | Seni Religi UB",
  description: "Cerita, karya, dan agenda terbaru dari Seni Religi Universitas Brawijaya.",
};

export default function AktivitasPage() {
  return (
    <SiteLayout>
      <Newsroom />
    </SiteLayout>
  );
}
