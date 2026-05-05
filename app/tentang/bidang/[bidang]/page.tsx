import { use } from "react";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/site-layout";
import { BIDANG_DATA } from "@/lib/bidang-data";
import HeroSection from "./components/hero";
import DeskripsiSection from "./components/deskripsi";
import GaleriSection from "./components/galeri";
import StrukturSection from "./components/struktur";
import BackSection from "./components/back";

export default function BidangDetailPage({ params }: { params: Promise<{ bidang: string }> }) {
  const { bidang } = use(params);
  const data = BIDANG_DATA[bidang];
  if (!data) notFound();

  return (
    <SiteLayout>
      <HeroSection data={data} />
      <DeskripsiSection data={data} />
      <GaleriSection data={data} />
      <StrukturSection data={data} />
      <BackSection />
    </SiteLayout>
  );
}
