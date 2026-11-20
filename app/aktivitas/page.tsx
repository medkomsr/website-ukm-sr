import { Suspense } from "react";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
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
      <Suspense fallback={<ContentSkeleton />}>
        <ContentData page="activities">
          <Newsroom />
        </ContentData>
      </Suspense>
    </SiteLayout>
  );
}
