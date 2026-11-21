import type { Metadata } from "next";
import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import BidangContent from "@/features/art-fields/components/bidang-content";
import { srFields } from "@/lib/constants/art-fields";
import { pageTitle } from "@/lib/site";
import { getBidangBySlug } from "@/sanity/queries/bidang";

type Props = { params: Promise<{ bidang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bidang: slug } = await params;
  const field = await getBidangBySlug(slug).catch(() => null);
  const name = field?.abbr || srFields.find((item) => item.slug === slug)?.name;
  return name ? { title: pageTitle(name) } : {};
}

async function Detail({ params }: Props) {
  const { bidang: slug } = await params;
  return (
    <ContentData page="field" slug={slug}>
      <BidangContent key={slug} slug={slug} />
    </ContentData>
  );
}

export default function BidangDetailPage({ params }: Props) {
  return (
    <SiteLayout footerWave={false}>
      <Suspense fallback={<ContentSkeleton />}>
        <Detail params={params} />
      </Suspense>
    </SiteLayout>
  );
}
