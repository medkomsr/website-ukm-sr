import { Suspense } from "react";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import SiteLayout from "@/components/layout/site-layout";
import AboutProfile from "@/features/about/components/about-profile";

export default function TentangPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<ContentSkeleton />}>
        <ContentData page="about">
          <AboutProfile />
        </ContentData>
      </Suspense>
    </SiteLayout>
  );
}
