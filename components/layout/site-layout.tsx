import { PublicHeader, PublicFooter } from "@/components/layout/site-shell";
import SiteContent from "./site-content";

export default function SiteLayout({
  children,
  footerWave = true,
}: {
  children: React.ReactNode;
  footerWave?: boolean;
}) {
  return (
    <div className="sr-public min-h-screen flex flex-col font-sans">
      <PublicHeader />
      <SiteContent>
        <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-24">
          {children}
        </main>
        <PublicFooter wave={footerWave} />
      </SiteContent>
    </div>
  );
}
