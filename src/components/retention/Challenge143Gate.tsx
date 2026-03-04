"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const UNLOCKED_KEY = "143_unlocked";
const UNLOCKED_AT_KEY = "143_unlocked_at";
const EMAIL_KEY = "143_unlock_email";

interface Challenge143GateProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

function hasUnlockedLocally(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(UNLOCKED_KEY) === "true";
}

function persistUnlocked() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNLOCKED_KEY, "true");
  window.localStorage.setItem(UNLOCKED_AT_KEY, Date.now().toString());
}

export function Challenge143Gate({ isAuthenticated, children }: Challenge143GateProps) {
  void isAuthenticated;

  const searchParams = useSearchParams();
  const router = useRouter();
  const unlockToken = useMemo(() => searchParams.get("unlock"), [searchParams]);

  const [checkingGate, setCheckingGate] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [devOnlyDetails, setDevOnlyDetails] = useState<{ unlockUrl: string; tokenHint: string } | null>(null);

  useEffect(() => {
    let canceled = false;

    async function resolveGate() {
      if (hasUnlockedLocally()) {
        setUnlocked(true);
        setCheckingGate(false);
        return;
      }

      if (!unlockToken) {
        setCheckingGate(false);
        return;
      }

      try {
        const unlockRes = await fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: unlockToken }),
        });

        if (unlockRes.ok) {
          const unlockData = (await unlockRes.json()) as { ok?: boolean };
          if (unlockData.ok && !canceled) {
            persistUnlocked();
            setUnlocked(true);
            setNotice("Unlocked. Welcome back.");
            router.replace("/143");
            return;
          }
        }

        // Backward compatibility with older signed unlock links.
        const legacyRes = await fetch(
          `/api/143/verify-token?token=${encodeURIComponent(unlockToken)}`,
          { cache: "no-store" },
        );
        if (legacyRes.ok && !canceled) {
          const legacyData = (await legacyRes.json()) as { valid?: boolean };
          if (legacyData.valid) {
            persistUnlocked();
            setUnlocked(true);
            setNotice("Unlocked. Welcome back.");
            router.replace("/143");
            return;
          }
        }

        if (!canceled) {
          setNotice("Unlock link expired. Request a fresh workbook email below.");
        }
      } catch {
        if (!canceled) {
          setNotice("We could not verify that link. Request a fresh unlock email.");
        }
      } finally {
        if (!canceled) {
          setCheckingGate(false);
        }
      }
    }

    void resolveGate();
    return () => {
      canceled = true;
    };
  }, [unlockToken, router]);

  async function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;

    setSubmittingEmail(true);
    setNotice("Sending...");
    setDevOnlyDetails(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          source: "143",
          redirect: "/143/index.html",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        devOnly?: boolean;
        unlockUrl?: string;
        tokenHint?: string;
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || "subscribe_failed");
      }

      window.localStorage.setItem(EMAIL_KEY, normalized);
      setShowCodeEntry(true);
      setNotice("Check your email for the workbook PDF and your unlock link.");

      if (data.devOnly) {
        setDevOnlyDetails({
          unlockUrl: data.unlockUrl ?? "",
          tokenHint: data.tokenHint ?? "",
        });
      }
    } catch {
      setNotice("Could not send the workbook email. Please try again.");
    } finally {
      setSubmittingEmail(false);
    }
  }

  async function submitCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;

    setSubmittingCode(true);
    setNotice("Verifying code...");

    try {
      const storedEmail = window.localStorage.getItem(EMAIL_KEY) || undefined;
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: normalizedCode,
          email: storedEmail,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || "unlock_failed");
      }

      persistUnlocked();
      setUnlocked(true);
      setNotice("Unlocked. Redirecting...");
      router.replace("/143/full.html");
    } catch {
      setNotice("Unlock failed. Request a fresh workbook email and try again.");
    } finally {
      setSubmittingCode(false);
    }
  }

  if (checkingGate) {
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
    return <>{children}</>;
  }

  return (
    <section className="content-wrap content-wrap--narrow py-12 sm:py-16">
      <div className="glass-card p-6 sm:p-8 space-y-5">
        <p className="pill pill--yellow" data-tone="yellow">
          <span className="dot" /> Workbook First Access
        </p>
        <h1 className="text-3xl font-bold text-header">
          143 challenge unlock starts with the workbook
        </h1>
        <p className="text-sm leading-relaxed text-body">
          Enter your email and we will send the workbook PDF plus your private unlock link.
          The full /143 page stays locked until you unlock.
        </p>

        <form onSubmit={submitEmail} className="space-y-3">
          <label htmlFor="challenge-gate-email" className="pill w-fit" style={{ "--accent": "var(--neon-blue)" } as React.CSSProperties}>
            <span className="dot" /> Email
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="challenge-gate-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
              className="flex-1 rounded-xl border border-stroke bg-surface/35 px-4 py-2.5 text-sm text-body outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
              disabled={submittingEmail}
            />
            <button
              type="submit"
              className="cta shrink-0"
              disabled={submittingEmail || !email.trim()}
            >
              {submittingEmail ? "Sending..." : "Email Me The Workbook + Unlock Link"}
            </button>
          </div>
        </form>

        {showCodeEntry && (
          <div className="glass-card--noGlow rounded-2xl p-4 space-y-3">
            <h2 className="text-base font-bold text-header">Enter unlock code</h2>
            <p className="text-sm text-secondary">
              If you opened the email on another device, paste the fallback code here.
            </p>
            <form onSubmit={submitCode} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={12}
                className="w-full rounded-xl border border-stroke bg-surface/35 px-4 py-2.5 text-sm uppercase tracking-[0.08em] text-body outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40 sm:w-56"
                disabled={submittingCode}
              />
              <button
                type="submit"
                className="btn-cta shrink-0"
                disabled={submittingCode || !code.trim()}
              >
                {submittingCode ? "Unlocking..." : "Unlock Full 143"}
              </button>
            </form>
          </div>
        )}

        {devOnlyDetails && (
          <div className="glass-card--noGlow rounded-2xl p-4 space-y-2" style={{ "--card-accent": "var(--neon-orange)" } as React.CSSProperties}>
            <p className="pill w-fit" style={{ "--accent": "var(--neon-orange)" } as React.CSSProperties}>
              <span className="dot" /> DEV ONLY
            </p>
            <p className="text-sm text-secondary">Email provider is not configured. Use this temporary unlock link/code for testing.</p>
            <p className="text-xs break-all text-body">
              Unlock link:{" "}
              <a href={devOnlyDetails.unlockUrl} className="underline" style={{ color: "var(--neon-blue)" }}>
                {devOnlyDetails.unlockUrl}
              </a>
            </p>
            <p className="text-xs text-body">Code: <strong>{devOnlyDetails.tokenHint}</strong></p>
          </div>
        )}

        {notice && (
          <p className="text-xs text-muted">{notice}</p>
        )}
      </div>
    </section>
  );
}
