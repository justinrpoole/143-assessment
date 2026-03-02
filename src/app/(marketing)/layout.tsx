import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/SiteFooter";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import { PageTransition } from "@/components/ui/PageTransition";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-[#F8D011] focus:text-[#020202] focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>
      <MarketingNav />
      <PageTransition>{children}</PageTransition>
      <StickyCtaBar />
      <SiteFooter />
    </>
  );
}
