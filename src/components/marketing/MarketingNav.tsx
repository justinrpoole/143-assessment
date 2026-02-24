"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import { isBetaFreeMode } from "@/lib/config/beta";
import {
  MARKETING_NAV_AUTH,
  MARKETING_NAV_CTAS,
  MARKETING_NAV_ITEMS,
  isNavGroup,
} from "@/lib/nav/nav-config";
import type { NavGroup } from "@/lib/nav/nav-config";

/* ── Sun-moon brand mark (matches logo fusion icon) ────── */

function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="22"
          y1="20"
          x2={22 + 16 * Math.cos((deg * Math.PI) / 180)}
          y2={20 + 16 * Math.sin((deg * Math.PI) / 180)}
          stroke="var(--brand-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      {/* Sun body */}
      <circle cx="22" cy="20" r="8" fill="var(--brand-gold)" />
      {/* Moon crescent (subtractive overlay) */}
      <circle cx="16" cy="18" r="9" fill="var(--brand-black, #0C0118)" />
      <circle cx="16" cy="18" r="7.5" fill="var(--brand-gold)" />
      <circle cx="19" cy="16" r="7" fill="var(--brand-black, #0C0118)" />
    </svg>
  );
}

/* ── Chevron ─────────────────────────────────────────────── */

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        transition: "transform 200ms ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
      aria-hidden="true"
    >
      <path
        d="M2 3.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Desktop dropdown ────────────────────────────────────── */

function DesktopDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        className="flex items-center gap-1 text-[13px] font-medium tracking-wide transition-colors"
        style={{ color: open ? "var(--brand-gold)" : "var(--text-on-dark-secondary)" }}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        {group.label}
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full pt-2" style={{ transform: "translateX(-50%)" }}>
          <div
            className="min-w-[190px] rounded-xl border p-1.5"
            style={{
              background: "rgba(12, 1, 24, 0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "rgba(248, 208, 17, 0.12)",
            }}
          >
            {group.children.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="dropdown-link block rounded-lg px-3 py-2 text-[13px] font-medium tracking-wide no-underline transition-colors"
                style={{ color: "var(--text-on-dark-secondary)" }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Mobile expandable section ───────────────────────────── */

function MobileSection({
  group,
  expanded,
  onToggle,
  onNavigate,
}: {
  group: NavGroup;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="w-full max-w-[280px]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-lg font-medium tracking-wide"
        style={{ color: "var(--text-on-dark)" }}
        aria-expanded={expanded}
      >
        {group.label}
        <ChevronDown open={expanded} />
      </button>
      {expanded && (
        <div className="mt-2 space-y-1 pl-4">
          {group.children.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="block py-1.5 text-base font-medium tracking-wide no-underline"
              style={{ color: "var(--text-on-dark-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main nav ────────────────────────────────────────────── */

export function MarketingNav() {
  const isBeta = isBetaFreeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [hasSession, setHasSession] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)user_state=([^;]*)/);
    if (match && match[1] && match[1] !== "public") {
      queueMicrotask(() => setHasSession(true));
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full border-b"
        style={{ borderColor: "var(--surface-border)", background: "var(--brand-black)" }}
        aria-label="Primary"
      >
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between gap-4 px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline" onClick={closeMenu}>
            <BrandMark size={28} />
            <span
              className="font-[700] font-serif text-[14px] uppercase tracking-[0.08em]"
              style={{
                color: "var(--color-outline-white)",
                fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
              }}
            >
              143 Leadership
            </span>
            {isBeta && (
              <span
                className="ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]"
                style={{ background: "var(--brand-gold)", color: "var(--brand-black)" }}
              >
                Free Beta
              </span>
            )}
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden items-center gap-5 lg:flex">
            {MARKETING_NAV_ITEMS.map((item) =>
              isNavGroup(item) ? (
                <DesktopDropdown key={item.label} group={item} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="dropdown-link text-[13px] font-medium tracking-wide no-underline transition-colors"
                  style={{ color: "var(--text-on-dark-secondary)" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sign In / Portal */}
            <Link
              href={hasSession ? MARKETING_NAV_AUTH.signedIn.href : MARKETING_NAV_AUTH.signedOut.href}
              className="hidden lg:inline-block text-[13px] font-medium tracking-wide no-underline transition-colors"
              style={{ color: "var(--text-on-dark-secondary)" }}
            >
              {hasSession ? MARKETING_NAV_AUTH.signedIn.label : MARKETING_NAV_AUTH.signedOut.label}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={MARKETING_NAV_CTAS.secondary.href}
              className="hidden lg:inline-block shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold tracking-wide no-underline transition-all hover:brightness-110"
              style={{ border: "1px solid var(--brand-gold)", color: "var(--brand-gold)" }}
            >
              {MARKETING_NAV_CTAS.secondary.label}
            </Link>

            {/* Primary CTA */}
            <Link
              href={MARKETING_NAV_CTAS.primary.href}
              className="shrink-0 rounded-lg px-4 py-2 text-[13px] font-bold tracking-wide no-underline transition-all hover:brightness-105"
              style={{ background: "var(--brand-gold)", color: "var(--brand-black)" }}
            >
              {MARKETING_NAV_CTAS.primary.label}
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.06)" }}
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
        <div className="fixed inset-0 z-40 flex flex-col lg:hidden" style={{ background: "rgba(2, 2, 2, 0.97)" }}>
          <div className="h-[60px] shrink-0" />

          <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto py-8">
            {MARKETING_NAV_ITEMS.map((item) =>
              isNavGroup(item) ? (
                <MobileSection
                  key={item.label}
                  group={item}
                  expanded={expandedMobile === item.label}
                  onToggle={() => setExpandedMobile((prev) => (prev === item.label ? null : item.label))}
                  onNavigate={closeMenu}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-lg font-medium tracking-wide no-underline"
                  style={{ color: "var(--text-on-dark)" }}
                >
                  {item.label}
                </Link>
              ),
            )}

            <div className="mt-4 flex flex-col items-center gap-3">
              <Link
                href={MARKETING_NAV_CTAS.primary.href}
                onClick={closeMenu}
                className="rounded-lg px-8 py-3 text-base font-bold tracking-wide no-underline transition-all hover:brightness-105"
                style={{ background: "var(--brand-gold)", color: "var(--brand-black)" }}
              >
                {MARKETING_NAV_CTAS.primary.label}
              </Link>
              <Link
                href={MARKETING_NAV_CTAS.secondary.href}
                onClick={closeMenu}
                className="rounded-lg px-8 py-3 text-base font-semibold tracking-wide no-underline transition-all hover:brightness-110"
                style={{ border: "1px solid var(--brand-gold)", color: "var(--brand-gold)" }}
              >
                {MARKETING_NAV_CTAS.secondary.label}
              </Link>
              <Link
                href={hasSession ? MARKETING_NAV_AUTH.signedIn.href : MARKETING_NAV_AUTH.signedOut.href}
                onClick={closeMenu}
                className="mt-1 text-sm font-medium tracking-wide no-underline"
                style={{ color: "var(--text-on-dark-muted)" }}
              >
                {hasSession ? MARKETING_NAV_AUTH.signedIn.label : MARKETING_NAV_AUTH.signedOut.label}
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dropdown-link:hover { color: var(--brand-gold) !important; }
        .dropdown-link:hover { background: rgba(248, 208, 17, 0.06); }
      `}</style>
    </>
  );
}
