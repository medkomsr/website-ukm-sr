import { use } from "react";
import SiteLayout from "@/components/site-layout";
import HeroSection from "./components/hero";
import DeskripsiSection from "./components/deskripsi";
import GaleriSection from "./components/galeri";
import StrukturSection from "./components/struktur";
import BackSection from "./components/back";

export default function BidangDetailPage({ params }: { params: Promise<{ bidang: string }> }) {
  const { bidang } = use(params);

  return (
    <SiteLayout>
      <HeroSection slug={bidang} />
      <DeskripsiSection slug={bidang} />
      <GaleriSection slug={bidang} />
      <StrukturSection slug={bidang} />
      <BackSection />
    </SiteLayout>
  );
}
