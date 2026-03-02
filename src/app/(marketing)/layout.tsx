import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/SiteFooter";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import { PageTransition } from "@/components/ui/PageTransition";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .cosmic-page-bg, .marketing-tron-root { background: #060014 !important; }
        main section { position: relative; }
        main section::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(37,246,255,0.06) 1px, transparent 1px), repeating-linear-gradient(transparent 0px, rgba(0,0,0,0.03) 1px, transparent 2px);
          background-size: 32px 32px, auto;
          opacity: 0.35;
        }
        main h1, main h2, main h3, main .gold-tag, main [class*="tracking-"] {
          font-family: var(--font-cosmic-display), Orbitron, sans-serif !important;
        }
        main p, main li, main span, main div { font-family: var(--font-body), 'Space Grotesk', sans-serif; }
        .gold-tag, .section-tag { color: #F8D011 !important; letter-spacing: 0.18em !important; text-transform: uppercase; }
        .glass-card {
          background: rgba(0,0,0,0.65) !important;
          border: 1px solid rgba(37,246,255,0.18) !important;
          border-radius: 1rem !important;
          box-shadow: inset 0 0 22px rgba(37,246,255,0.08);
        }
      ` }} />
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
