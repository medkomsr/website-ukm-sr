import Navbar from "./navbar";
import Footer from "./footer";
import { getSiteSettings } from "@/sanity/queries/siteSettings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <div className="h-16 md:h-[72px]" />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
