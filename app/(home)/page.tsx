import SrHome from "@/features/home/components/sr-home";
import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
export default function Home() {
  return (
    <Suspense
      fallback={
        <SiteLayout>
          <ContentSkeleton />
        </SiteLayout>
      }
    >
      <ContentData page="home">
        <SrHome />
      </ContentData>
    </Suspense>
  );
}
