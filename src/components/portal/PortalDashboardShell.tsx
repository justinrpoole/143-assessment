'use client';

/**
 * PortalDashboardShell — thin client that fetches real scores + renders IlluminateDashboard
 * Replaces the display layer of LightDashboardClient.
 */

import { useState, useEffect, useCallback } from 'react';
import IlluminateDashboard from '@/components/cosmic/IlluminateDashboard';
import StarChart from '@/components/portal/StarChart';

interface PortalSummary {
  has_completed_run: boolean;
  last_run_id:       string | null;
  reps_this_week:    number;
  streak_days:       number;
  eclipse_level:     'low' | 'medium' | 'high' | null;
  bottom_ray_name:   string | null;
}


interface ResultsData {
  ray_scores: Partial<Record<string, number>>;
  top_rays:   string[];
}

const ECLIPSE_MAP: Record<string, number> = { high: 70, medium: 40, low: 20 };

const DEMO_SCORES: Partial<Record<string, number>> = {
  R1:55,R2:38,R3:72,R4:61,R5:44,R6:83,R7:29,R8:67,R9:56,
};

export default function PortalDashboardShell() {
  const [scores,    setScores]    = useState<Partial<Record<string,number>>>(DEMO_SCORES);
  const [eclipse,   setEclipse]   = useState(0);
  const [repsToday, setRepsToday] = useState(0);
  const [phase,     setPhase]     = useState<'ECLIPSE'|'DAWN'|'RADIANT'>('ECLIPSE');
  const [hasRun,    setHasRun]    = useState(false);
  const [loading,   setLoading]   = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const summRes = await fetch('/api/portal/summary');
      if (!summRes.ok) return;
      const summary: PortalSummary = await summRes.json();
      setHasRun(summary.has_completed_run);
      setEclipse(ECLIPSE_MAP[summary.eclipse_level ?? ''] ?? 0);

      if (summary.has_completed_run && summary.last_run_id) {
        const runRes = await fetch('/api/runs/' + summary.last_run_id + '/results');
        if (runRes.ok) {
          const data: ResultsData = await runRes.json();
          setScores(data.ray_scores ?? DEMO_SCORES);
          const r9 = data.ray_scores?.R9 ?? 0;
          setPhase(r9 >= 70 ? 'RADIANT' : r9 >= 40 ? 'DAWN' : 'ECLIPSE');
        }
      }

      const repsRes = await fetch('/api/reps?limit=50');
      if (repsRes.ok) {
        const { reps } = await repsRes.json() as { reps: Array<{ logged_at: string }> };
        const today = new Date().toDateString();
        setRepsToday(reps.filter(r => new Date(r.logged_at).toDateString() === today).length);
      }
    } catch { /* degrade gracefully */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const handleLogRep = useCallback(async () => {
    try {
      await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_name: 'watch_me', reflection_note: null }),
      });
      setRepsToday(r => r + 1);
    } catch { /* silent */ }
  }, []);

  const handleWatchMe = useCallback(() => { window.open('/portal/watch-me', '_blank'); }, []);
  const handleGoFirst = useCallback(() => { window.open('/portal/go-first', '_blank'); }, []);

  if (loading) {
    return (
      <div style={{
        background:'#4A0E78',borderRadius:20,padding:'60px 0',
        display:'flex',flexDirection:'column',alignItems:'center',gap:16,
        fontFamily:"'Orbitron',system-ui,sans-serif",
        border:'1px solid rgba(255,255,255,0.06)',
      }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes illum-pulse2{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
        <div style={{fontSize:10,letterSpacing:'.28em',color:'#F4C430',animation:'illum-pulse2 1.5s ease-in-out infinite'}}>CALIBRATING YOUR LIGHT...</div>
        <div style={{width:48,height:48,borderRadius:'50%',border:'3px solid rgba(37,246,255,0.2)',borderTop:'3px solid #25F6FF',animation:'spin 1s linear infinite'}} />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl p-4 sm:p-5 overflow-hidden" style={{ background: '#060014', border: '1px solid rgba(37,246,255,0.2)', boxShadow: 'inset 0 0 24px rgba(37,246,255,0.08)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(37,246,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,246,255,0.08) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      <div className="relative z-10">
      <p className="mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)', textShadow: '0 0 10px rgba(37,246,255,0.6)' }}>
        Portal Command Dashboard
      </p>
      {!hasRun && (
        <div style={{
          marginBottom:16,padding:'12px 18px',borderRadius:12,
          background:'rgba(255,209,102,0.08)',border:'1px solid rgba(255,209,102,0.2)',
          fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:'rgba(255,255,255,0.7)',
          display:'flex',alignItems:'center',gap:12,
        }}>
          <span style={{fontSize:18}}>🌑</span>
          <span>No light signature yet. Take the assessment — 143 questions, one clean map.{' '}
            <a href="/assessment" style={{color:'#F4C430',textDecoration:'underline'}}>Start →</a>
          </span>
        </div>
      )}
      <IlluminateDashboard
        scores={scores}
        eclipseLevel={eclipse}
        phase={phase}
        repsToday={repsToday}
        onWatchMe={handleWatchMe}
        onGoFirst={handleGoFirst}
        onLogRep={handleLogRep}
      />
      <div className="mt-6">
        <StarChart />
      </div>
      </div>
    </div>
  );
}
