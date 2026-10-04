import { ElegantHeader, ElegantFooter } from "./elegant-shell";
import GsapStage from "./gsap-stage";

export default function SiteLayout({
  children,
  footerWave = true,
}: {
  children: React.ReactNode;
  footerWave?: boolean;
}) {
  return (
    <div className="sr-public min-h-screen flex flex-col font-sans">
      <ElegantHeader />
      <GsapStage>
        <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-24">
          {children}
        </main>
        <ElegantFooter wave={footerWave}/>
      </GsapStage>
    </div>
  );
}
