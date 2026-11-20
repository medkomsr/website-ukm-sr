import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import StoryDetail from "@/features/activities/components/detail/story-detail";

type Props = { params: Promise<{ id: string }> };

async function Detail({ params }: Props) {
  const { id: slug } = await params;
  return (
    <ContentData page="story" slug={slug}>
      <StoryDetail key={slug} slug={slug} />
    </ContentData>
  );
}

export default function AktivitasDetailPage({ params }: Props) {
  return (
    <SiteLayout footerWave={false}>
      <Suspense fallback={<ContentSkeleton />}>
        <Detail params={params} />
      </Suspense>
    </SiteLayout>
  );
}
