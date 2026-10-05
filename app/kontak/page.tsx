import SiteLayout from "@/components/layout/site-layout";
import FAQSection from "@/features/contact/components/faq";
import MainContactSection from "@/features/contact/components/main-contact";

export default function KontakPage() {
  return (
    <SiteLayout>
      <div>
        <MainContactSection />
        <FAQSection />
      </div>
    </SiteLayout>
  );
}
