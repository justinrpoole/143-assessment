import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/SiteFooter";

export default function PreviewCosmicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      {children}
      <SiteFooter />
    </>
  );
}
