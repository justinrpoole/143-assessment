import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/SiteFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      {children}
      <SiteFooter />
    </>
  );
}
