"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

import { isBetaFreeMode } from "@/lib/config/beta";

const NAV_LINKS = [
  { href: "/upgrade-your-os", label: "Upgrade Your OS" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/outcomes", label: "Outcomes" },
  { href: "/pricing", label: "Pricing" },
  { href: "/143", label: "143 Challenge" },
  { href: "/corporate", label: "For Teams" },
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
      <nav className="sticky top-0 z-50 w-full border-b" style={{ borderColor: 'var(--surface-border)', background: 'var(--brand-black)' }} aria-label="Primary">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between gap-4 px-6">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="5.5" fill="var(--brand-gold)" />
              {SUN_ANGLES.map((deg) => (
                <line
                  key={deg}
                  x1="14" y1="14"
                  x2={14 + 11.5 * Math.cos((deg * Math.PI) / 180)}
                  y2={14 + 11.5 * Math.sin((deg * Math.PI) / 180)}
                  stroke="var(--brand-gold)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <span className="font-[700] font-serif text-[14px] uppercase tracking-[0.08em]"
              style={{ color: 'var(--color-outline-white)', fontFamily: '"Iowan Old Style", Palatino, Georgia, serif' }}>
              143 Leadership
            </span>
            {isBeta && (
              <span className="ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]"
                style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}>
                Free Beta
              </span>
            )}
          </Link>

          {/* Center nav links — desktop */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium tracking-wide no-underline transition-colors hover:text-brand-gold"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sign In / My Portal — desktop */}
            <Link
              href={hasSession ? "/portal" : "/login"}
              className="hidden md:inline-block text-[13px] font-medium tracking-wide no-underline transition-colors hover:text-brand-gold"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {hasSession ? "My Portal" : "Sign In"}
            </Link>

            {/* CTA */}
            <Link
              href="/143"
              className="shrink-0 rounded-lg px-4 py-2 text-[13px] font-bold tracking-wide no-underline transition-all hover:brightness-105"
              style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
            >
              Start 143 Challenge
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
                    <line x1="4" y1="4" x2="16" y2="16" stroke="var(--color-outline-white)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="var(--color-outline-white)" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="5" x2="17" y2="5" stroke="var(--color-outline-white)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="var(--color-outline-white)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="15" x2="17" y2="15" stroke="var(--color-outline-white)" strokeWidth="1.5" strokeLinecap="round" />
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
                className="text-xl font-medium tracking-wide no-underline transition-colors hover:text-brand-gold"
                style={{ color: 'var(--text-on-dark)' }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/143"
              onClick={closeMenu}
              className="mt-4 rounded-lg px-8 py-3 text-base font-bold tracking-wide no-underline transition-all hover:brightness-105"
              style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
            >
              Start 143 Challenge
            </Link>
            <Link
              href={hasSession ? "/portal" : "/login"}
              onClick={closeMenu}
              className="mt-2 text-sm font-medium tracking-wide no-underline transition-colors hover:text-brand-gold"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              {hasSession ? "My Portal" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
