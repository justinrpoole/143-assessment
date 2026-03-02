"use client";

import { useState } from "react";
import GroupCoachingWaitlistForm from "./GroupCoachingWaitlistForm";

export default function GroupCoachingGateClient({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#F8D011" }}>
          The Light Cohort
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
          Apply to unlock full cohort details.
        </h1>
        <p className="text-base" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
          Share your name, email, and why now. I review every application personally.
        </p>
        <GroupCoachingWaitlistForm onSuccess={() => setUnlocked(true)} />
      </section>
    );
  }

  return <>{children}</>;
}
