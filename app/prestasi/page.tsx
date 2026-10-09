import { Suspense } from "react";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import SiteLayout from "@/components/layout/site-layout";
import AchievementExperience from "@/features/achievements/components/achievement-experience";

export const metadata = {
  title: "Prestasi | UKM Seni Religi UB",
  description:
    "Rekam jejak prestasi dan penghargaan UKM Seni Religi Universitas Brawijaya dari tingkat kampus hingga nasional.",
};

export default function PrestasiPage() {
  return (
    <SiteLayout footerWave={false}>
      <Suspense fallback={<ContentSkeleton />}>
        <ContentData page="achievements">
          <AchievementExperience />
        </ContentData>
      </Suspense>
    </SiteLayout>
  );
}
