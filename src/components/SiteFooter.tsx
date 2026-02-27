import Image from "next/image";
import Link from "next/link";

import CosmicStarfield from "@/components/cosmic/CosmicStarfield";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import { MARKETING_FOOTER_COLUMNS } from "@/lib/nav/nav-config";

export function SiteFooter() {
  return (
    <footer
      className="relative border-t px-6 py-16 sm:px-8 sm:py-20 overflow-hidden"
      style={{ borderColor: 'rgba(248, 208, 17, 0.08)', background: 'var(--overlay-light)' }}
    >
      <CosmicStarfield />
      <GoldDividerAnimated className="mb-12" neon />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10">
          <Image
            src="/images/logo-full-transparent.png"
            alt="143 Leadership"
            width={140}
            height={47}
            className="h-auto"
            style={{ maxWidth: "140px", filter: 'drop-shadow(0 0 12px rgba(248, 208, 17, 0.15))' }}
          />
          <p className="mt-3 text-xs tracking-wider" style={{ color: 'rgba(248, 208, 17, 0.4)', letterSpacing: '0.15em' }}>
            MEASURE &middot; TRAIN &middot; SUSTAIN
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {MARKETING_FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-gold)', letterSpacing: '0.18em' }}>
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-all duration-200 hover:text-white hover:translate-x-0.5 inline-block"
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

        {/* Gold gradient rule */}
        <div className="mt-12 mb-6 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(248, 208, 17, 0.15), transparent)' }} />

        <div
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          <p>&copy; {new Date().getFullYear()} 143 Leadership. All rights reserved.</p>
          <p style={{ color: 'rgba(248, 208, 17, 0.35)', fontStyle: 'italic' }}>143 means I love you. That is where this starts.</p>
        </div>
      </div>
    </footer>
  );
}
