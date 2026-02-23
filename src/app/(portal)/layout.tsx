import type { ReactNode } from "react";

import PortalTabBar from "@/components/portal/PortalTabBar";
import { PageShell } from "@/components/ui/PageShell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell after={<PortalTabBar />}>
      {children}
    </PageShell>
  );
}
