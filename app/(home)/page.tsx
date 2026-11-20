import type { Metadata } from "next";
import SrHome from "@/features/home/components/sr-home";
import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Seni Religi UB",
  url: "https://senireligi.ub.ac.id/",
};
const title = `${website.name} - Situs Resmi`;

export const metadata: Metadata = {
  title,
  openGraph: { type: "website", siteName: website.name, title, url: website.url },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }}
      />
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
    </>
  );
}
