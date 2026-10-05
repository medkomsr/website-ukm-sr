import { use } from "react";
import SiteLayout from "@/components/layout/site-layout";
import StoryDetail from "@/features/activities/components/detail/story-detail";

export default function AktivitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);

  return (
    <SiteLayout footerWave={false}>
      <StoryDetail key={slug} slug={slug} />
    </SiteLayout>
  );
}
