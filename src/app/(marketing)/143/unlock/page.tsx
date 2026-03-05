"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UNLOCKED_KEY = "143_unlocked";
const UNLOCKED_AT_KEY = "143_unlocked_at";

type UnlockState = "checking" | "success" | "error";

function persistUnlocked() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNLOCKED_KEY, "true");
  window.localStorage.setItem(UNLOCKED_AT_KEY, Date.now().toString());
}

export default function Challenge143UnlockPage() {
  const router = useRouter();
  const [state, setState] = useState<UnlockState>("checking");
  const [message, setMessage] = useState("Verifying your unlock link…");

  useEffect(() => {
    let canceled = false;
    const token =
      typeof window === "undefined"
        ? ""
        : new URLSearchParams(window.location.search).get("token")?.trim() || "";

    if (!token) {
      setState("error");
      setMessage("Missing unlock token. Request a fresh workbook email.");
      return;
    }

    async function verifyUnlock() {
      try {
        const res = await fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Unlock failed.");
        }

        if (canceled) return;
        persistUnlocked();
        setState("success");
        setMessage("Unlocked. Redirecting to /143…");

        setTimeout(() => {
          router.replace("/143");
        }, 450);
      } catch (error) {
        if (canceled) return;
        setState("error");
        setMessage(error instanceof Error ? error.message : "Unlock failed. Request a fresh workbook email.");
      }
    }

    void verifyUnlock();
    return () => {
      canceled = true;
    };
  }, [router]);

  return (
    <main className="cosmic-page-bg page-shell">
      <section className="content-wrap content-wrap--narrow py-14 sm:py-20">
        <div className="glass-card p-7 sm:p-9 space-y-4" style={{ "--card-accent": "var(--gold-primary)" } as { ["--card-accent"]: string }}>
          <p className="pill pill--yellow w-fit" data-tone="yellow">
            <span className="dot" /> 143 Unlock
          </p>
          <h1 className="text-2xl font-bold text-header">
            {state === "success" ? "ACCESS UNLOCKED" : "VERIFYING ACCESS"}
          </h1>
          <p className="text-sm leading-relaxed text-body">{message}</p>
          {state === "error" && (
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/143" className="cta">
                Back to 143 gate
              </Link>
              <Link href="/challenge" className="btn-secondary">
                Get workbook email again
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
