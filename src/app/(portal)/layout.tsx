import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import PortalTabBar from "@/components/portal/PortalTabBar";
import PortalWelcome from "@/components/portal/PortalWelcome";
import { SiteFooter } from "@/components/SiteFooter";
import { PageShell } from "@/components/ui/PageShell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PortalWelcome />
      <MarketingNav />
      <PageShell after={<PortalTabBar />}>
        {children}
      </PageShell>
      <SiteFooter />
    </>
  );
}
