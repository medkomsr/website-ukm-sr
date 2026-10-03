import { ElegantHeader, ElegantFooter } from "./elegant-shell";
import GsapStage from "./gsap-stage";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <ElegantHeader />
      <GsapStage>
        <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-24">
          {children}
        </main>
        <ElegantFooter />
      </GsapStage>
    </div>
  );
}
