"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  { id: "energy", label: "How is your energy right now?", low: "Running on empty", high: "Fully charged" },
  { id: "stress", label: "How much pressure are you carrying today?", low: "Minimal", high: "Overwhelming" },
  { id: "sleep", label: "How has your sleep been the last 3 nights?", low: "Rough", high: "Solid" },
];

export default function StateFirstPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>({ energy: 3, stress: 3, sleep: 3 });

  function handleContinue() {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_state", JSON.stringify(scores));
    }
    router.push("/onboarding/tools-first");
  }

  return (
    <main className="cosmic-page-bg min-h-screen flex items-center justify-center px-5">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <p className="gold-tag inline-block mb-4">Before We Show Your Map</p>
          <h1 className="text-2xl font-bold text-white mb-2">Where are you starting from?</h1>
          <p className="text-sm" style={{color:"var(--text-on-dark-secondary)"}}>
            Your results are shaped by your current state. This takes 30 seconds.
          </p>
        </div>
        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="glass-card p-5 space-y-3">
              <p className="text-sm font-medium text-white">{q.label}</p>
              <input
                type="range" min={1} max={5} value={scores[q.id]}
                onChange={e => setScores(s => ({...s, [q.id]: Number(e.target.value)}))}
                className="w-full accent-yellow-400"
              />
              <div className="flex justify-between text-xs" style={{color:"var(--text-on-dark-secondary)"}}>
                <span>{q.low}</span><span className="font-semibold text-yellow-400">{scores[q.id]} / 5</span><span>{q.high}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleContinue}
          className="w-full py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all"
          style={{background:"linear-gradient(180deg,#FFD35A 0%,#E07800 100%)",color:"#060014",boxShadow:"0 4px 20px rgba(255,211,90,0.4)"}}>
          Next: Your Tools →
        </button>
        <p className="text-center text-xs" style={{color:"var(--text-on-dark-secondary)"}}>
          This context helps us read your scores accurately. Your light isn&apos;t gone. It might just be covered.
        </p>
      </div>
    </main>
  );
}
