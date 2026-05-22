import { use } from "react";
import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/aktivitas/[id]/components/hero";
import ContentSection from "@/app/aktivitas/[id]/components/content";
import RelatedSection from "@/app/aktivitas/[id]/components/related";

export default function AktivitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);

  return (
    <SiteLayout>
      {/* ── Hero ──────────────────────────────────────── */}
      <HeroSection slug={slug} />

      {/* ── Body ──────────────────────────────────────── */}
      <ContentSection slug={slug} />

      {/* ── Related ───────────────────────────────────── */}
      <RelatedSection slug={slug} />
    </SiteLayout>
  );
}
