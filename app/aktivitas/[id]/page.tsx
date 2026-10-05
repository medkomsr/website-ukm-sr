import { use } from "react";
import SiteLayout from "@/components/site-layout";
import StoryDetail from "./components/story-detail";

export default function AktivitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);

  return (
    <SiteLayout footerWave={false}>
      <StoryDetail key={slug} slug={slug} />
    </SiteLayout>
  );
}
