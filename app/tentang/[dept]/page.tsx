import { use } from "react";
import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/tentang/[dept]/components/hero";
import DeskripsiSection from "@/app/tentang/[dept]/components/deskripsi";
import ProgramKerjaSection from "@/app/tentang/[dept]/components/program-kerja";
import StrukturOrganisasiSection from "@/app/tentang/[dept]/components/struktur-organisasi";
import BackSection from "@/app/tentang/[dept]/components/back";

export default function DeptDetailPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = use(params);

  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection dept={dept} />

      {/* ── Description ──────────────────────────────────────────── */}
      <DeskripsiSection dept={dept} />

      {/* ── Program Kerja ─────────────────────────────────────────── */}
      <ProgramKerjaSection dept={dept} />

      {/* ── Struktur Organisasi ───────────────────────────────────── */}
      <StrukturOrganisasiSection dept={dept} />

      {/* ── Back button ───────────────────────────────────────────── */}
      <BackSection />
    </SiteLayout>
  );
}
