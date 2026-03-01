"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RAYS = [
  { name: "Intention", color: "#F8D011" }, { name: "Joy", color: "#FF6B35" },
  { name: "Presence", color: "#7C3AED" }, { name: "Power", color: "#EC4899" },
  { name: "Purpose", color: "#06B6D4" }, { name: "Authenticity", color: "#10B981" },
  { name: "Connection", color: "#F59E0B" }, { name: "Possibility", color: "#8B5CF6" },
  { name: "Be The Light", color: "#FFFFFF" },
];

function ScoringInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const runId = searchParams.get("run_id");
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(p => {
        if (p >= RAYS.length) { clearInterval(t); setDone(true); return p; }
        return p + 1;
      });
    }, 300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push(runId ? `/results?run_id=${runId}` : "/results"), 900);
    return () => clearTimeout(t);
  }, [done, runId, router]);

  return (
    <main className="cosmic-page-bg min-h-screen flex items-center justify-center">
      <div className="text-center px-6 py-16 max-w-sm mx-auto">
        <p className="gold-tag inline-block mb-6">Calibrating</p>
        <h1 className="text-2xl font-bold text-white mb-2">{done ? "Your map is ready." : "Reading your signal..."}</h1>
        <p className="text-sm mb-8" style={{color:"var(--text-on-dark-secondary)"}}>
          {done ? "Revealing your 9 Rays now." : "Calculating your 9 capacities."}
        </p>
        <div className="space-y-3">
          {RAYS.map((ray, i) => (
            <div key={ray.name} className="flex items-center gap-3 glass-card px-4 py-2.5 transition-all duration-400"
              style={{opacity: i < visible ? 1 : 0, transform: i < visible ? "none" : "translateX(-10px)"}}>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:ray.color, boxShadow:`0 0 8px ${ray.color}`}} />
              <span className="text-sm font-medium" style={{color:ray.color}}>{ray.name}</span>
              {i < visible && <span className="ml-auto text-xs text-green-400">✓</span>}
            </div>
          ))}
        </div>
        {done && <p className="mt-8 text-sm font-semibold" style={{color:"#FFD35A"}}>Opening your results...</p>}
      </div>
    </main>
  );
}

export default function AssessmentScoringPage() {
  return (
    <Suspense fallback={<main className="cosmic-page-bg min-h-screen" />}>
      <ScoringInner />
    </Suspense>
  );
}
