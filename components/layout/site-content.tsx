import type { ReactNode } from "react";

/** Preserves the public-page wrappers and clearance below the floating navigation. */
export default function SiteContent({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="pt-[88px] max-[900px]:pt-[76px]">{children}</div>
    </div>
  );
}
