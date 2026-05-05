import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/kontak/components/header";
import FAQSection from "@/app/kontak/components/faq";
import MainContactSection from "@/app/kontak/components/main-contact";

export default function KontakPage() {
  return (
    <SiteLayout>
      {/* Header */}
      <HeaderSection />

      {/* Main contact */}
      <MainContactSection />

      {/* FAQ — shadcn Accordion */}
      <FAQSection />
    </SiteLayout>
  );
}
