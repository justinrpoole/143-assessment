"use client";

import { useState } from "react";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";

export default function WatchMeGateClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function unlock() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, tag: "watch-me-gate" }),
      });
      if (!res.ok) throw new Error();
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--gold-primary)", fontFamily: "var(--font-cosmic-display)" }}>Unlock Watch Me</p>
        <p className="text-sm" style={{ color: "color-mix(in srgb, var(--text-body) 78%, transparent)" }}>Drop your name and email to unlock the deeper Watch Me playbook.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="rounded-xl border px-4 py-3 text-sm" style={{ background: "color-mix(in srgb, var(--ink-950) 50%, transparent)", borderColor: "color-mix(in srgb, var(--neon-cyan) 20%, transparent)", color: "var(--text-body)" }} />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="rounded-xl border px-4 py-3 text-sm" style={{ background: "color-mix(in srgb, var(--ink-950) 50%, transparent)", borderColor: "color-mix(in srgb, var(--neon-cyan) 20%, transparent)", color: "var(--text-body)" }} />
        </div>
        <button onClick={() => void unlock()} disabled={!name || !email || loading} className="rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: "var(--gold-primary)", color: "var(--ink-950)" }}>
          {loading ? "Unlocking…" : "Unlock Watch Me"}
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-8 space-y-4">
      <p className="text-sm leading-relaxed" style={{ color: "color-mix(in srgb, var(--text-body) 82%, transparent)" }}>
        Watch Me is your ignition switch. I use it when the room is loud, my attention is split, and I need to come back online fast. Two words. One breath. Your signal returns.
      </p>
      <NeonGlowButton href="/preview">Start free Stability Check → discover which Ray needs Watch Me</NeonGlowButton>
    </div>
  );
}
