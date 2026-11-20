import { Suspense } from "react";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import SiteLayout from "@/components/layout/site-layout";
import FAQSection from "@/features/contact/components/faq";
import MainContactSection from "@/features/contact/components/main-contact";

export default function KontakPage() {
  return (
    <SiteLayout>
      <div>
        <MainContactSection />
        <Suspense fallback={<ContentSkeleton compact />}>
          <ContentData page="contact">
            <FAQSection />
          </ContentData>
        </Suspense>
      </div>
    </SiteLayout>
  );
}
