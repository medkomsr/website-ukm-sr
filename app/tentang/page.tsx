import { Suspense } from "react";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import SiteLayout from "@/components/layout/site-layout";
import AboutProfile from "@/features/about/components/about-profile";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Tentang Kami"),
};

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
