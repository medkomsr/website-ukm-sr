import { notFound } from "next/navigation";
import SiteLayout from "@/components/site-layout";
import HeroSection from "@/app/aktivitas/[id]/components/hero";
import ContentSection from "@/app/aktivitas/[id]/components/content";
import RelatedSection from "@/app/aktivitas/[id]/components/related";
import { getAktivitasBySlug, getRelatedAktivitas } from "@/sanity/queries/aktivitas";

export default async function AktivitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;

  const item = await getAktivitasBySlug(slug);
  if (!item) notFound();

  const relatedFinal = await getRelatedAktivitas(slug, item.category);

  const isEvent = item.type === "event";

  return (
    <SiteLayout>
      <HeroSection item={item} isEvent={isEvent} />
      <ContentSection item={item} isEvent={isEvent} />
      {relatedFinal.length > 0 && <RelatedSection related={relatedFinal} />}
    </SiteLayout>
  );
}
