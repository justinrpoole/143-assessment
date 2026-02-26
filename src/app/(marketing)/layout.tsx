import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/ui/PageTransition";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
    </>
  );
}
