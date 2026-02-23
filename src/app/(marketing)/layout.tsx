import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="cosmic-page-bg">
      <MarketingNav />
      {children}
    </main>
  );
}
