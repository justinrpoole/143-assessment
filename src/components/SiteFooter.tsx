import Image from "next/image";
import Link from "next/link";

import { MARKETING_FOOTER_COLUMNS } from "@/lib/nav/nav-config";

export function SiteFooter() {
  return (
    <footer
      className="relative px-6 py-14 sm:px-8 sm:py-20 overflow-hidden"
      style={{ background: "#F8D011" }}
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Logo + tagline */}
        <div className="mb-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/images/143-sun-eclipsed-logo.svg"
            alt="143 Leadership"
            width={160}
            height={160}
            className="h-auto"
            style={{ maxWidth: "160px" }}
          />
          <p
            className="text-sm font-semibold tracking-wide sm:text-right"
            style={{ color: "#020202", maxWidth: "280px", lineHeight: 1.5 }}
          >
            Measure your light.<br />
            Train your light.<br />
            Sustain your light.
          </p>
        </div>

        {/* Divider */}
        <div className="mb-10" style={{ height: "2px", background: "rgba(2, 2, 2, 0.12)" }} />

        {/* Nav columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {MARKETING_FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "#FFFFFF", letterSpacing: "0.18em", textShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
              >
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-all duration-200 hover:text-white inline-block"
                      style={{ color: "#020202" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs"
          style={{ borderTop: "2px solid rgba(2, 2, 2, 0.12)", color: "rgba(2, 2, 2, 0.55)" }}
        >
          <p>&copy; {new Date().getFullYear()} 143 Leadership. All rights reserved.</p>
          <p style={{ color: "#FFFFFF", fontWeight: 600, fontStyle: "italic", textShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
            143 means I love you. That is where this starts.
          </p>
        </div>
      </div>
    </footer>
  );
}
