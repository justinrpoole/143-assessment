'use client';

import type { LightSignatureOutput } from '@/lib/types';
import { RAY_VERBS } from '@/lib/types';

interface Props {
  lightSignature: LightSignatureOutput;
}

export default function LightSignature({ lightSignature }: Props) {
  const { archetype, top_two } = lightSignature;

  return (
    <section className="space-y-6">
      {/* Archetype Hero Card */}
      {archetype && (
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-glow-md)' }}>
          <div
            className="px-6 py-8 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--bg-deep-mid) 0%, rgba(114, 21, 184, 0.30) 50%, var(--bg-deep) 100%)',
              borderBottom: '1px solid var(--surface-border)',
            }}
          >
            <p className="text-sm tracking-widest uppercase mb-2" style={{ color: 'var(--brand-gold)' }}>
              Your Light Signature
            </p>
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}>
              {archetype.name}
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {archetype.essence}
            </p>

            {/* Top Two Ray Tags */}
            <div className="flex justify-center gap-3 mt-5">
              {top_two.map((ray) => (
                <span
                  key={ray.ray_id}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'var(--surface-glass)', color: 'var(--text-on-dark)', border: '1px solid var(--surface-border)' }}
                >
                  {ray.ray_name} — {RAY_VERBS[ray.ray_id] || ''}
                </span>
              ))}
            </div>
          </div>

          {/* Expressions */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ background: 'var(--surface-glass)' }}>
            {archetype.work_expression && (
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--brand-gold)' }}>At Work</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.work_expression}</p>
              </div>
            )}
            {archetype.life_expression && (
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--brand-gold)' }}>In Life</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.life_expression}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Power Sources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Your Power Sources</h3>
        {top_two.map((ray, i) => (
          <div key={ray.ray_id} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: 'var(--brand-gold)', fontSize: '18px' }}>&#9733;</span>
              <h4 className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {ray.ray_name} — {RAY_VERBS[ray.ray_id] || ''}
              </h4>
              {i === 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(255, 207, 0, 0.12)', color: 'var(--brand-gold)' }}>
                  Primary
                </span>
              )}
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-on-dark-secondary)' }}>{ray.why_resourced}</p>
            <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              Under load: {ray.under_load_distortion}
            </p>
          </div>
        ))}
      </div>

      {/* Natural Strengths from archetype */}
      {archetype?.strengths && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-gold)' }}>What This Combination Creates</h3>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.strengths}</p>
        </div>
      )}

      {/* Under load / stress distortion */}
      {archetype?.stress_distortion && (
        <div className="rounded-xl p-5" style={{ background: 'rgba(255, 207, 0, 0.06)', border: '1px solid rgba(255, 207, 0, 0.12)' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--brand-gold)' }}>Under Load — What to Watch For</h3>
          <p className="text-xs mb-2 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
            This is not a problem. It is the leading edge of your strength under pressure. Naming it is the rep.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.stress_distortion}</p>
        </div>
      )}

      {/* Coaching Logic — How to Work With This Signature */}
      {archetype?.coaching_logic && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--brand-gold)' }}>Coaching Logic</h3>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.coaching_logic}</p>
        </div>
      )}

      {/* Starting Tools & Micro Reps */}
      {(archetype?.starting_tools || archetype?.micro_reps) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {archetype.starting_tools && (
            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--brand-gold)' }}>Starting Tools</p>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.starting_tools}</p>
            </div>
          )}
          {archetype.micro_reps && (
            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--brand-gold)' }}>Micro Reps</p>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.micro_reps}</p>
            </div>
          )}
        </div>
      )}

      {/* Reflection Prompts from Archetype */}
      {archetype?.reflection_prompts && (
        <div className="rounded-xl p-5" style={{ background: 'rgba(96, 5, 141, 0.12)', border: '1px solid rgba(148, 80, 200, 0.2)' }}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--brand-gold)' }}>Archetype Reflections</p>
          <p className="text-sm italic" style={{ color: 'var(--text-on-dark-secondary)' }}>{archetype.reflection_prompts}</p>
        </div>
      )}
    </section>
  );
}
