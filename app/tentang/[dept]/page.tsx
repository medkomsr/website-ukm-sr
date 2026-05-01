import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SiteLayout from "@/components/site-layout";
import { DEPT_DATA, DeptMember, DeptDivisi } from "@/lib/data";
import HeroSection from "@/components/tentang/hero";
import DeskripsiSection from "@/components/tentang/deskripsi";
import ProgramKerjaSection from "@/components/tentang/program-kerja";
import StrukturOrganisasiSection from "@/components/tentang/struktur-organisasi";
import BackSection from "@/components/tentang/back";

export default function DeptDetailPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = use(params);
  const data = DEPT_DATA[dept];
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
