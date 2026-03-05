"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isBetaFreeMode } from "@/lib/config/beta";
import {
  MARKETING_NAV_AUTH,
  MARKETING_NAV_CTAS,
  MARKETING_NAV_ITEMS,
  isNavGroup,
} from "@/lib/nav/nav-config";
import type { NavGroup } from "@/lib/nav/nav-config";

/* ── Chevron ─────────────────────────────────────────────── */

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
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

function DesktopDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = pathname === group.href || group.children.some((c) => pathname === c.href);
  const triggerClass = `marketing-nav__link text-[13px] font-medium tracking-wide no-underline ${open || isActive ? "marketing-nav__link--active" : ""}`;
  const chevronClass = `marketing-nav__icon-btn flex items-center ${open || isActive ? "marketing-nav__icon-btn--active" : ""}`;

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
      <div className="flex items-center gap-1">
        {group.href ? (
          <Link
            href={group.href}
            className={triggerClass}
          >
            {group.label}
          </Link>
        ) : (
          <button
            type="button"
            className={triggerClass}
            onClick={() => setOpen((p) => !p)}
          >
            {group.label}
          </button>
        )}
        <button
          type="button"
          className={chevronClass}
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          aria-label={`${group.label} submenu`}
        >
          <ChevronDown open={open} />
        </button>
      </div>

      {open && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
          <div className="marketing-nav__dropdown-panel">
            {group.children.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="marketing-nav__dropdown-item block px-3 py-2 text-[13px] font-medium tracking-wide"
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
      <div className="flex w-full items-center justify-between">
        {group.href ? (
          <Link
            href={group.href}
            onClick={onNavigate}
            className="marketing-nav__mobile-link text-lg font-medium tracking-wide"
          >
            {group.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="marketing-nav__mobile-link text-lg font-medium tracking-wide"
          >
            {group.label}
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="marketing-nav__mobile-link flex items-center p-2"
          aria-expanded={expanded}
          aria-label={`${group.label} submenu`}
        >
          <ChevronDown open={expanded} />
        </button>
      </div>
      {expanded && (
        <div className="mt-2 space-y-1 pl-4">
          {group.children.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="marketing-nav__mobile-secondary-link block py-1.5 text-base font-medium tracking-wide"
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
  const pathname = usePathname();
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
      <nav className="marketing-nav" aria-label="Primary">
        <div className="content-wrap--wide marketing-nav__inner">
          {/* Logo */}
          <Link href="/" className="marketing-nav__brand shrink-0" aria-label="143 — Home" onClick={closeMenu}>
            <Image
              src="/images/143-landscape-logo.svg"
              alt="143"
              width={216}
              height={48}
              className="h-[26px] w-auto sm:h-[30px]"
              priority
            />
            {isBeta && (
              <span className="marketing-nav__beta px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                Free Beta
              </span>
            )}
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden items-center gap-5 lg:flex">
            {MARKETING_NAV_ITEMS.map((item) =>
              isNavGroup(item) ? (
                <DesktopDropdown key={item.label} group={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`marketing-nav__link text-[13px] font-medium tracking-wide no-underline ${pathname === item.href ? "marketing-nav__link--active" : ""}`}
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
              className="marketing-nav__auth-link hidden lg:inline-block text-[13px] font-medium tracking-wide"
            >
              {hasSession ? MARKETING_NAV_AUTH.signedIn.label : MARKETING_NAV_AUTH.signedOut.label}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={MARKETING_NAV_CTAS.secondary.href}
              className="marketing-nav__cta-secondary hidden lg:inline-block shrink-0 rounded-lg px-3 py-1 text-[12px] font-semibold tracking-wide transition-all hover:brightness-110"
            >
              {MARKETING_NAV_CTAS.secondary.label}
            </Link>

            {/* Primary CTA */}
            <Link
              href={MARKETING_NAV_CTAS.primary.href}
              className="marketing-nav__cta-primary shrink-0 rounded-lg px-3.5 py-1.5 text-[12px] font-bold tracking-wide transition-all hover:brightness-105"
            >
              {MARKETING_NAV_CTAS.primary.label}
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="marketing-nav__menu-btn flex h-9 w-9 items-center justify-center rounded-lg transition-colors lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-body">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      {menuOpen && (
        <div className="marketing-nav__overlay fixed inset-0 z-40 flex flex-col lg:hidden">
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
                  className="marketing-nav__mobile-link text-lg font-medium tracking-wide"
                >
                  {item.label}
                </Link>
              ),
            )}

            <div className="mt-4 flex flex-col items-center gap-3">
              <Link
                href={MARKETING_NAV_CTAS.primary.href}
                onClick={closeMenu}
                className="marketing-nav__cta-primary rounded-lg px-8 py-3 text-base font-bold tracking-wide transition-all hover:brightness-105"
              >
                {MARKETING_NAV_CTAS.primary.label}
              </Link>
              <Link
                href={MARKETING_NAV_CTAS.secondary.href}
                onClick={closeMenu}
                className="marketing-nav__cta-secondary rounded-lg px-8 py-3 text-base font-semibold tracking-wide transition-all hover:brightness-110"
              >
                {MARKETING_NAV_CTAS.secondary.label}
              </Link>
              <Link
                href={hasSession ? MARKETING_NAV_AUTH.signedIn.href : MARKETING_NAV_AUTH.signedOut.href}
                onClick={closeMenu}
                className="marketing-nav__mobile-muted-link mt-1 text-sm font-medium tracking-wide"
              >
                {hasSession ? MARKETING_NAV_AUTH.signedIn.label : MARKETING_NAV_AUTH.signedOut.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
