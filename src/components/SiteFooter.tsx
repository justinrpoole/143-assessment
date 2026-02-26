import Image from "next/image";
import Link from "next/link";

import CosmicStarfield from "@/components/cosmic/CosmicStarfield";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import { MARKETING_FOOTER_COLUMNS } from "@/lib/nav/nav-config";

export function SiteFooter() {
  return (
    <footer
      className="relative border-t px-6 py-12 sm:px-8 overflow-hidden"
      style={{ borderColor: 'var(--surface-border)', background: 'var(--overlay-light)' }}
    >
      <CosmicStarfield />
      <GoldDividerAnimated className="mb-10" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-8">
          <Image
            src="/images/logo-full-transparent.png"
            alt="143 Leadership"
            width={120}
            height={40}
            className="h-auto opacity-70"
            style={{ maxWidth: "120px" }}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {MARKETING_FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-gold)' }}>
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'var(--text-on-dark-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs"
          style={{ borderTop: '1px solid var(--surface-border)', color: 'var(--text-on-dark-muted)' }}
        >
          <p>&copy; {new Date().getFullYear()} 143 Leadership. All rights reserved.</p>
          <p>Measure your light. Train your light. Sustain your light.</p>
        </div>
      </div>
    </footer>
  );
}
