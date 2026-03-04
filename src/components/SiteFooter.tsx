import Image from "next/image";
import Link from "next/link";

import { MARKETING_FOOTER_COLUMNS } from "@/lib/nav/nav-config";

export function SiteFooter() {
  return (
    <footer className="site-footer relative overflow-hidden px-6 py-14 sm:px-8 sm:py-20">
      <div className="site-footer__inner relative z-10">
        {/* Logo + tagline */}
        <div className="mb-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/images/logo-leadership-full.svg"
            alt="143 Leadership"
            width={160}
            height={160}
            className="site-footer__logo h-auto"
          />
          <p className="site-footer__tagline text-sm font-semibold tracking-wide sm:text-right">
            Measure your light.<br />
            Train your light.<br />
            Sustain your light.
          </p>
        </div>

        {/* Divider */}
        <div className="site-footer__divider mb-10" />

        {/* Nav columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {MARKETING_FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="site-footer__heading mb-4 text-[11px] font-bold uppercase tracking-widest">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="site-footer__link inline-block text-sm transition-all duration-200 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom mt-12 flex flex-col gap-2 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} 143 Leadership. All rights reserved.</p>
          <p className="site-footer__motto">
            143 means I love you. That is where this starts.
          </p>
        </div>
      </div>
    </footer>
  );
}
