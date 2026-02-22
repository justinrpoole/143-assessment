"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

import { isBetaFreeMode } from "@/lib/config/beta";

const NAV_LINKS = [
  { href: "/assessment", label: "Assessment" },
  { href: "/framework", label: "Framework" },
  { href: "/143-challenge", label: "143 Challenge" },
  { href: "/organizations", label: "For Organizations" },
  { href: "/about", label: "About" },
];

// Sun ray angles for the logo mark
const SUN_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function MarketingNav() {
  const isBeta = isBetaFreeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // user_state cookie is not httpOnly — readable client-side
    const match = document.cookie.match(/(?:^|;\s*)user_state=([^;]*)/);
    if (match && match[1] && match[1] !== 'public') {
      setHasSession(true);
    }
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[rgba(248,208,17,0.12)] bg-[#020202]" aria-label="Primary">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between gap-4 px-6">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="5.5" fill="#F8D011" />
              {SUN_ANGLES.map((deg) => (
                <line
                  key={deg}
                  x1="14" y1="14"
                  x2={14 + 11.5 * Math.cos((deg * Math.PI) / 180)}
                  y2={14 + 11.5 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#F8D011"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <span className="font-[700] font-serif text-[14px] uppercase tracking-[0.08em] text-[#FDFCFD]"
              style={{ fontFamily: '"Iowan Old Style", Palatino, Georgia, serif' }}>
              143 Leadership
            </span>
            {isBeta && (
              <span className="ml-1.5 rounded-full bg-[#F8D011] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#020202]">
                Free Beta
              </span>
            )}
          </Link>

          {/* Center nav links — desktop */}
          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-[rgba(253,252,253,0.7)] no-underline transition-colors hover:text-[#F8D011]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sign In / My Portal — desktop */}
            <Link
              href={hasSession ? "/portal" : "/login"}
              className="hidden text-[13px] font-medium tracking-wide text-[rgba(253,252,253,0.7)] no-underline transition-colors hover:text-[#F8D011] md:inline-block"
            >
              {hasSession ? "My Portal" : "Sign In"}
            </Link>

            {/* CTA */}
            <Link
              href="/assessment"
              className="shrink-0 rounded-lg bg-[#F8D011] px-4 py-2 text-[13px] font-bold tracking-wide text-[#020202] no-underline transition-all hover:brightness-105"
            >
              Take the Assessment
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="#FDFCFD" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="#FDFCFD" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="5" x2="17" y2="5" stroke="#FDFCFD" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="#FDFCFD" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="15" x2="17" y2="15" stroke="#FDFCFD" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col md:hidden"
          style={{ background: 'rgba(2, 2, 2, 0.97)' }}
        >
          {/* Spacer for nav height */}
          <div className="h-[60px] shrink-0" />

          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="text-xl font-medium tracking-wide text-[rgba(253,252,253,0.85)] no-underline transition-colors hover:text-[#F8D011]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/assessment"
              onClick={closeMenu}
              className="mt-4 rounded-lg bg-[#F8D011] px-8 py-3 text-base font-bold tracking-wide text-[#020202] no-underline transition-all hover:brightness-105"
            >
              Take the Assessment
            </Link>
            <Link
              href={hasSession ? "/portal" : "/login"}
              onClick={closeMenu}
              className="mt-2 text-sm font-medium tracking-wide text-[rgba(253,252,253,0.6)] no-underline transition-colors hover:text-[#F8D011]"
            >
              {hasSession ? "My Portal" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
