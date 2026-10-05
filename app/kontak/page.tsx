import SiteLayout from "@/components/site-layout";
import FAQSection from "@/app/kontak/components/faq";
import MainContactSection from "@/app/kontak/components/main-contact";

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
