import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import BidangContent from "@/features/art-fields/components/bidang-content";

type Props = { params: Promise<{ bidang: string }> };

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
