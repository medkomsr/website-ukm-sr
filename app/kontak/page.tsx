import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/components/kontak/header";
import FAQSection from "@/components/kontak/faq";
import MainContactSection from "@/components/kontak/main-contact";

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
