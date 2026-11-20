import type { Metadata } from "next";
import SrHome from "@/features/home/components/sr-home";
import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import { siteName, siteUrl } from "@/lib/site";

const title = `${siteName} - Situs Resmi`;

export const metadata: Metadata = {
  title,
  openGraph: { type: "website", siteName, title, url: siteUrl },
};

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
