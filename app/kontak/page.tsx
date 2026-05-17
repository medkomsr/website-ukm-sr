import SiteLayout from "@/components/site-layout";
import HeaderSection from "@/app/kontak/components/header";
import FAQSection from "@/app/kontak/components/faq";
import MainContactSection from "@/app/kontak/components/main-contact";
import { getAllFaq } from "@/sanity/queries/faq";
import { getSiteSettings } from "@/sanity/queries/siteSettings";

export default async function KontakPage() {
  const [faqs, settings] = await Promise.all([
    getAllFaq(),
    getSiteSettings(),
  ]);

  return (
    <SiteLayout>
      <HeaderSection />
      <MainContactSection settings={settings} />
      <FAQSection items={faqs} />
    </SiteLayout>
  );
}
