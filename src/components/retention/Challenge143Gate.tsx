"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ToolkitDeliveryClient } from "@/components/retention/ToolkitDeliveryClient";

const STORAGE_KEY = "challenge_143_unlocked";
const COOKIE_KEY = "challenge_143_unlocked";

interface Challenge143GateProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

function hasUnlockedLocally(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function persistUnlocked() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "1");
  document.cookie = `${COOKIE_KEY}=1; path=/; max-age=${60 * 60 * 24 * 90}`;
}

export function Challenge143Gate({ isAuthenticated, children }: Challenge143GateProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const unlockToken = useMemo(() => searchParams.get("unlock"), [searchParams]);

  useEffect(() => {
    let canceled = false;

    async function resolveGate() {
      if (hasUnlockedLocally()) {
        setUnlocked(true);
        setCheckingToken(false);
        return;
      }

      if (!unlockToken) {
        setCheckingToken(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/143/verify-token?token=${encodeURIComponent(unlockToken)}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          setNotice("Unlock link expired. Request a fresh workbook email below.");
          setCheckingToken(false);
          return;
        }

        const data = (await res.json()) as { valid?: boolean };
        if (!canceled && data.valid) {
          persistUnlocked();
          setUnlocked(true);
          setNotice("Unlocked. Welcome back.");
          router.replace("/143");
        }
      } catch {
        if (!canceled) {
          setNotice("We could not verify that link. Request a fresh unlock email.");
        }
      } finally {
        if (!canceled) {
          setCheckingToken(false);
        }
      }
    }

    void resolveGate();
    return () => {
      canceled = true;
    };
  }, [unlockToken, router]);

  if (checkingToken) {
    return (
      <section className="content-wrap content-wrap--narrow py-16">
        <div className="glass-card p-7 sm:p-9">
          <p className="pill pill--yellow mb-4" data-tone="yellow">
            <span className="dot" /> Checking access
          </p>
          <h1 className="text-2xl font-bold text-header">Verifying your /143 unlock link</h1>
          <p className="mt-3 text-sm text-body">
            Hold one moment while we validate your workbook token.
          </p>
        </div>
      </section>
    );
  }

  if (unlocked) {
    return (
      <>
        {notice && (
          <section className="content-wrap content-wrap--narrow pb-4 pt-2">
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-header">{notice}</p>
            </div>
          </section>
        )}
        {children}
      </>
    );
  }

  return (
    <section className="content-wrap content-wrap--narrow py-12 sm:py-16">
      <div className="glass-card p-6 sm:p-8 space-y-5">
        <p className="pill pill--yellow" data-tone="yellow">
          <span className="dot" /> Workbook First Access
        </p>
        <h1 className="text-3xl font-bold text-header">
          143 Challenge unlock starts with the workbook
        </h1>
        <p className="text-sm leading-relaxed text-body">
          Enter your email to receive the PDF workbook and a private unlock link.
          After you open that link from your inbox, the full /143 page unlocks on this device.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/marketing/143-challenge-workbook.pdf" className="cta">
            Preview Workbook PDF
          </Link>
        </div>

        {notice && (
          <p className="text-xs text-muted">{notice}</p>
        )}

        <ToolkitDeliveryClient isAuthenticated={isAuthenticated} />
      </div>
    </section>
  );
}

