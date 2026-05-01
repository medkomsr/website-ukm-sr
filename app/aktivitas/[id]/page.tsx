import { use } from "react";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/site-layout";
import { activities, Activity } from "@/lib/data";

import RelatedSection from "@/components/aktivitas/related";
import ContentSection from "@/components/aktivitas/content";
import HeroSection from "@/components/aktivitas/hero";

export default function AktivitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = activities.find((a) => a.id === id);
  if (!item) notFound();

  const isEvent = item.type === "event";
  const related = activities.filter((a) => a.id !== item.id && (a.category === item.category || a.type === item.type)).slice(0, 3);

  return (
    <SiteLayout>
      {/* ── Hero ──────────────────────────────────────── */}
      <HeroSection item={item} isEvent={isEvent} />

      {/* ── Body ──────────────────────────────────────── */}
      <ContentSection item={item} isEvent={isEvent} />

      {/* ── Related ───────────────────────────────────── */}
      {related.length > 0 && <RelatedSection related={related} />}
    </SiteLayout>
  );
}
