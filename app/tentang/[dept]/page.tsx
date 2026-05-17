import { notFound } from "next/navigation";
import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/tentang/[dept]/components/hero";
import DeskripsiSection from "@/app/tentang/[dept]/components/deskripsi";
import ProgramKerjaSection from "@/app/tentang/[dept]/components/program-kerja";
import StrukturOrganisasiSection from "@/app/tentang/[dept]/components/struktur-organisasi";
import BackSection from "@/app/tentang/[dept]/components/back";
import { getDepartemenBySlug } from "@/sanity/queries/departemen";

export default async function DeptDetailPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = await params;
  const data = await getDepartemenBySlug(dept);
  if (!data) notFound();

  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection data={data} />

      {/* ── Description ──────────────────────────────────────────── */}
      <DeskripsiSection data={data} />

      {/* ── Program Kerja ─────────────────────────────────────────── */}
      <ProgramKerjaSection data={data} />

      {/* ── Struktur Organisasi ───────────────────────────────────── */}
      <StrukturOrganisasiSection data={data} />

      {/* ── Back button ───────────────────────────────────────────── */}
      <BackSection />
    </SiteLayout>
  );
}
