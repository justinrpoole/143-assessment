'use client';

import { useState } from 'react';
import SolarCoreScore from '@/components/cosmic/SolarCoreScore';
import EclipseMeter from '@/components/cosmic/EclipseMeter';
import MoonToSunSlider from '@/components/cosmic/MoonToSunSlider';
import MoonToSunArc from '@/components/cosmic/MoonToSunArc';
import MagneticFieldRing from '@/components/cosmic/MagneticFieldRing';
import BlackHoleFlags from '@/components/cosmic/BlackHoleFlags';
import OrbitMap from '@/components/cosmic/OrbitMap';
import AuroraCelebration from '@/components/cosmic/AuroraCelebration';
import StardustCheckins from '@/components/cosmic/StardustCheckins';
import ShootingStarActions from '@/components/cosmic/ShootingStarActions';
import AtmosphereShield from '@/components/cosmic/AtmosphereShield';
import CometMoments from '@/components/cosmic/CometMoments';
import NovaMoment from '@/components/cosmic/NovaMoment';
import ExpansionArc from '@/components/cosmic/ExpansionArc';
import CopyGuardrails from '@/components/cosmic/CopyGuardrails';
import GravitationalStability from '@/components/cosmic/GravitationalStability';
import SpacetimeWell from '@/components/cosmic/SpacetimeWell';
import SolarLifecycle from '@/components/cosmic/SolarLifecycle';
import MandalaPhases from '@/components/cosmic/MandalaPhases';
import ConstellationProgress from '@/components/cosmic/ConstellationProgress';
import SolarWindMomentum from '@/components/cosmic/SolarWindMomentum';
import PlanetaryAlignment from '@/components/cosmic/PlanetaryAlignment';
import NebulaIncubation from '@/components/cosmic/NebulaIncubation';
import EscapeVelocity from '@/components/cosmic/EscapeVelocity';
import SolarFlareJournal from '@/components/cosmic/SolarFlareJournal';
import PhotosphereDepth from '@/components/cosmic/PhotosphereDepth';
import BinaryStarPartnership from '@/components/cosmic/BinaryStarPartnership';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import type { EclipseOutput, RayOutput } from '@/lib/types';

/* ── Mock Data ── */

const MOCK_RAYS: Record<string, RayOutput> = {
  R1: { ray_id: 'R1', ray_name: 'Intention', score: 72, net_energy: 72, access_score: 65, eclipse_score: 28, eclipse_modifier: 'NONE', subfacets: {} },
  R2: { ray_id: 'R2', ray_name: 'Joy', score: 45, net_energy: 45, access_score: 38, eclipse_score: 58, eclipse_modifier: 'NONE', subfacets: {} },
  R3: { ray_id: 'R3', ray_name: 'Presence', score: 68, net_energy: 68, access_score: 60, eclipse_score: 32, eclipse_modifier: 'NONE', subfacets: {} },
  R4: { ray_id: 'R4', ray_name: 'Power', score: 85, net_energy: 85, access_score: 80, eclipse_score: 15, eclipse_modifier: 'NONE', subfacets: {} },
  R5: { ray_id: 'R5', ray_name: 'Purpose', score: 91, net_energy: 91, access_score: 88, eclipse_score: 9, eclipse_modifier: 'NONE', subfacets: {} },
  R6: { ray_id: 'R6', ray_name: 'Authenticity', score: 63, net_energy: 63, access_score: 55, eclipse_score: 42, eclipse_modifier: 'AMPLIFIED', subfacets: {} },
  R7: { ray_id: 'R7', ray_name: 'Connection', score: 78, net_energy: 78, access_score: 72, eclipse_score: 22, eclipse_modifier: 'NONE', subfacets: {} },
  R8: { ray_id: 'R8', ray_name: 'Possibility', score: 56, net_energy: 56, access_score: 48, eclipse_score: 46, eclipse_modifier: 'NONE', subfacets: {} },
  R9: { ray_id: 'R9', ray_name: 'Be The Light', score: 82, net_energy: 82, access_score: 78, eclipse_score: 18, eclipse_modifier: 'NONE', subfacets: {} },
};

const MOCK_TOP_TWO = ['R5', 'R4'];
const MOCK_BOTTOM_RAY = 'R2';

const MOCK_ECLIPSE: EclipseOutput = {
  level: 'MODERATE',
  dimensions: { emotional_load: { score: 2.1 }, cognitive_load: { score: 1.8 }, relational_load: { score: 1.5 } },
  derived_metrics: { recovery_access: 68, load_pressure: 42, eer: 1.4, bri: 2 },
  gating: { mode: 'BUILD_RANGE', reason: 'You have room to build — stay intentional about load.' },
};

const MOCK_ECLIPSE_LEVELS: Array<{ eclipse: EclipseOutput; label: string; level: string }> = [
  { eclipse: { level: 'LOW', dimensions: { emotional_load: { score: 0.8 }, cognitive_load: { score: 0.6 }, relational_load: { score: 0.5 } }, derived_metrics: { recovery_access: 88, load_pressure: 14, eer: 2.3, bri: 0 }, gating: { mode: 'STRETCH', reason: 'Clear.' } }, label: 'Low', level: 'low' },
  { eclipse: MOCK_ECLIPSE, label: 'Moderate', level: 'moderate' },
  { eclipse: { level: 'ELEVATED', dimensions: { emotional_load: { score: 2.8 }, cognitive_load: { score: 2.5 }, relational_load: { score: 2.6 } }, derived_metrics: { recovery_access: 42, load_pressure: 68, eer: 0.9, bri: 4 }, gating: { mode: 'STABILIZE', reason: 'Stability needed.' } }, label: 'Elevated', level: 'elevated' },
  { eclipse: { level: 'HIGH', dimensions: { emotional_load: { score: 3.2 }, cognitive_load: { score: 2.9 }, relational_load: { score: 3.0 } }, derived_metrics: { recovery_access: 28, load_pressure: 84, eer: 0.7, bri: 6 }, gating: { mode: 'STABILIZE', reason: 'Stability needed.' } }, label: 'High', level: 'high' },
];

function overallScore(rays: Record<string, RayOutput>): number {
  const vals = Object.values(rays).map((r) => r.net_energy ?? r.score);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

const NAV_SECTIONS = [
  { href: '#results', label: 'Results' },
  { href: '#ongoing', label: 'Ongoing' },
  { href: '#narrative', label: 'Narrative' },
  { href: '#extended', label: 'Extended' },
];

/* ── Page ── */

export default function CosmicPreview() {
  const [showAurora, setShowAurora] = useState(false);
  const [showNova, setShowNova] = useState(false);

  return (
    <div className="cosmic-page-bg">
      <AuroraCelebration show={showAurora} improvedRay="R4" rayName="Ray of Power" duration={5000} onComplete={() => setShowAurora(false)} />
      <NovaMoment show={showNova} rayName="Ray of Power" message="Ray of Power remembered." duration={4000} onComplete={() => setShowNova(false)} />

      <a href="#main-content" className="skip-to-content">Skip to content</a>

      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6"
        style={{ height: '56px', background: 'var(--overlay-medium)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--surface-border)' }}
      >
        <span className="text-sm uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-gold)' }}>
          143 Leadership
        </span>
        <nav aria-label="Main navigation" className="flex gap-6">
          {NAV_SECTIONS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm cosmic-focus-target hidden sm:inline"
              style={{ color: 'var(--text-on-dark-secondary)', fontWeight: 500, textDecoration: 'none' }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-on-dark-secondary)')}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ minHeight: '50vh' }}>
        <div
          className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(96, 5, 141, 0.30) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(248, 208, 17, 0.05) 0%, transparent 40%), radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.30) 1px, transparent 0), radial-gradient(1px 1px at 72% 32%, rgba(255,255,255,0.18) 1px, transparent 0), radial-gradient(1px 1px at 88% 60%, rgba(255,255,255,0.25) 1px, transparent 0)' }}
        />
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-on-dark)', fontWeight: 500 }}>All 28 Cosmic Visualizations</p>
          <h1 className="text-4xl sm:text-5xl leading-[1.1] mb-5 uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-gold)', letterSpacing: '0.04em' }}>Cosmic Assessment Report</h1>
          <p className="text-base max-w-xl mx-auto mb-10" style={{ color: 'var(--text-on-dark)', lineHeight: 1.65 }}>
            The complete visual system — from nine-ray capacity maps and eclipse meters through stardust check-ins, constellation progress, and cosmic background radiation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#results" className="btn-primary cosmic-focus-target">Explore</a>
            <button className="btn-secondary cosmic-focus-target" onClick={() => setShowAurora(true)}>Trigger Aurora</button>
            <button className="btn-secondary cosmic-focus-target" onClick={() => setShowNova(true)}>Trigger Nova</button>
          </div>
        </div>
      </section>

      <main id="main-content">

        {/* ═══ ASSESSMENT RESULTS (1-6) ═══ */}
        <div id="results" className="pt-8"><CatHead title="Assessment Results" sub="Components 1–6" /></div>

        <Sec id="s-eclipse" n="01" title="Eclipse Meter" desc="Your current load as eclipse coverage — eclipsed capacity is not lost, just temporarily covered.">
          <div className="grid gap-6 sm:grid-cols-2">
            {MOCK_ECLIPSE_LEVELS.map(({ eclipse, label, level }) => (
              <div key={level} className="glass-card p-5">
                <div className="flex justify-center mb-3"><span className={`status-pill status-pill--${level}`}>{label}</span></div>
                <EclipseMeter eclipse={eclipse} />
              </div>
            ))}
          </div>
        </Sec>

        <Sec id="s-solar" n="02" title="Nine-Ray Capacity Map" desc="Each beam represents a ray of capacity. Length shows energy level.">
          <div className="glass-card p-6 sm:p-8"><SolarCoreScore rays={MOCK_RAYS} topTwo={MOCK_TOP_TWO} bottomRay={MOCK_BOTTOM_RAY} loadPercent={42} /></div>
        </Sec>

        <Sec id="s-coherence" n="03" title="Magnetic Field Ring" desc="Coherent rays create a smooth halo. Scattered rays produce a fragmented ring.">
          <MagneticFieldRing rays={MOCK_RAYS} />
        </Sec>

        <Sec id="s-orbit" n="04" title="Orbit Map" desc="Your personal solar system — rays sorted into inner, middle, and outer orbits.">
          <OrbitMap rays={MOCK_RAYS} topTwo={MOCK_TOP_TWO} bottomRay={MOCK_BOTTOM_RAY} />
        </Sec>

        <Sec id="s-blackhole" n="05" title="Black Hole Flags" desc="Energy leaks where eclipse exceeds capacity. Tap a black hole for interventions.">
          <BlackHoleFlags rays={MOCK_RAYS} eclipse={MOCK_ECLIPSE} />
        </Sec>

        <Sec id="s-aurora" n="06" title="Aurora Celebration" desc="When a Ray improves week-over-week, aurora borealis sweeps the screen.">
          <div className="text-center"><button className="btn-primary cosmic-focus-target" onClick={() => setShowAurora(true)}>Trigger Aurora</button></div>
        </Sec>

        {/* ═══ ONGOING EXPERIENCE (7-10) ═══ */}
        <div id="ongoing" className="pt-8"><CatHead title="Ongoing Experience" sub="Components 7–10" /></div>

        <Sec id="s-stardust" n="07" title="Stardust Check-ins" desc="Meditative instinct check-in. Tap the field to create ripples. Streak constellation forms below.">
          <StardustCheckins streakDays={7} />
        </Sec>

        <Sec id="s-shooting" n="08" title="Shooting Star Actions" desc="Action items as shooting stars. Complete to leave a permanent glow trail.">
          <ShootingStarActions actions={[
            { id: 'a1', rayId: 'R8', rayName: 'Ray of Possibility', action: 'Write down one thing you have been avoiding exploring.' },
            { id: 'a2', rayId: 'R3', rayName: 'Ray of Presence', action: 'Take three conscious breaths before your next meeting.' },
            { id: 'a3', rayId: 'R2', rayName: 'Ray of Joy', action: 'Name one thing that genuinely delighted you today.' },
          ]} />
        </Sec>

        <Sec id="s-shield" n="09" title="Atmosphere Shield" desc="Boundary protection — toggle the golden dome to see protected vs exposed states.">
          <AtmosphereShield active={true} strength={75} />
        </Sec>

        <Sec id="s-comet" n="10" title="Comet Moments" desc="Rare opportunity capture — comets with gold dust tails. Tap to capture.">
          <CometMoments comets={[
            { id: 'c1', label: 'New collaboration', rayId: 'R7' },
            { id: 'c2', label: 'Creative insight', rayId: 'R8' },
            { id: 'c3', label: 'Leadership moment', rayId: 'R9' },
          ]} />
        </Sec>

        {/* ═══ NARRATIVE LAYER (11-13) ═══ */}
        <div id="narrative" className="pt-8"><CatHead title="Narrative Layer" sub="Components 11–13" /></div>

        <Sec id="s-nova" n="11" title="Nova Moment" desc="A star detonates into white-gold when a Ray clears from eclipse.">
          <div className="text-center"><button className="btn-primary cosmic-focus-target" onClick={() => setShowNova(true)}>Trigger Nova</button></div>
        </Sec>

        <Sec id="s-expansion" n="12" title="Expansion Arc Timeline" desc="Your growth arc — from tight past orbits to spacious present system.">
          <ExpansionArc milestones={[
            { id: 'm1', label: 'Collaborator arrived', rayColor: '#1ABC9C' },
            { id: 'm2', label: 'New opportunity', rayColor: '#D4770B' },
            { id: 'm3', label: 'Realization', rayColor: '#F4C430' },
            { id: 'm4', label: 'Breakthrough', rayColor: '#C0392B' },
            { id: 'm5', label: 'Integration', rayColor: '#8E44AD' },
          ]} />
        </Sec>

        <Sec id="s-copy" n="13" title="Copy Guardrails" desc="The 143 voice in context — warm, grounded, poetic, never clinical.">
          <CopyGuardrails />
        </Sec>

        {/* ═══ EXTENDED CONCEPTS (14-28) ═══ */}
        <div id="extended" className="pt-8"><CatHead title="Extended Concepts" sub="Components 14–28" /></div>

        <Sec id="s-slider" n="14" title="Moon-to-Sun Slider" desc="Overall score mapped from crescent moon to radiant sun.">
          <MoonToSunSlider score={overallScore(MOCK_RAYS)} label="Your light today" />
        </Sec>

        <Sec id="s-arc" n="15" title="Sunrise Arc" desc="Vertical dawn — your personal sun is rising.">
          <div className="grid sm:grid-cols-2 gap-6">
            <MoonToSunArc score={overallScore(MOCK_RAYS)} label="Current score" />
            <MoonToSunArc score={35} label="Early dawn" />
          </div>
        </Sec>

        <Sec id="s-gravity" n="16" title="Gravitational Stability" desc="Chaotic vs stable orbits — your system's equilibrium state.">
          <GravitationalStability rays={MOCK_RAYS} />
        </Sec>

        <Sec id="s-spacetime" n="17" title="Spacetime Well" desc="Gravitational curvature — your centering power warps spacetime.">
          <SpacetimeWell rays={MOCK_RAYS} />
        </Sec>

        <Sec id="s-lifecycle" n="18" title="Solar Lifecycle" desc="Framework phases as stellar evolution — molecular cloud to supergiant.">
          <SolarLifecycle currentPhase={4} />
        </Sec>

        <Sec id="s-mandala" n="19" title="Cycle Mandala" desc="Nine sun states in a sacred circle — eclipse to full sun and back.">
          <MandalaPhases score={overallScore(MOCK_RAYS)} />
        </Sec>

        <Sec id="s-constellation" n="20" title="Constellation Progress" desc="Author your own mythology — one gold star at a time.">
          <ConstellationProgress constellationName="The Lightkeeper" dateRange="Jan 2026 – Present" stars={[
            { id: 's1', label: 'First assessment', completed: true, major: true },
            { id: 's2', label: 'Daily intention set', completed: true },
            { id: 's3', label: 'Boundary held', completed: true },
            { id: 's4', label: 'Joy practice started', completed: true },
            { id: 's5', label: 'Power remembered', completed: true, major: true },
            { id: 's6', label: 'Presence pause', completed: true },
            { id: 's7', label: 'First rep logged', completed: true },
            { id: 's8', label: 'Connection deepened', completed: false },
            { id: 's9', label: 'Authenticity revealed', completed: false },
            { id: 's10', label: 'Purpose aligned', completed: false, major: true },
            { id: 's11', label: 'Possibility explored', completed: false },
            { id: 's12', label: 'Light shared', completed: false },
          ]} />
        </Sec>

        <Sec id="s-solarwind" n="21" title="Solar Wind Momentum" desc="Directed energy flow — strong gold stream vs sparse aimless particles.">
          <SolarWindMomentum rays={MOCK_RAYS} />
        </Sec>

        <Sec id="s-planets" n="22" title="Planetary Alignment" desc="Five primary rays as planets aligned along a beam from the 143 sun.">
          <PlanetaryAlignment rays={MOCK_RAYS} />
        </Sec>

        <Sec id="s-nebula" n="23" title="Nebula Incubation" desc="Goals forming but not yet ignited — patient potential, not failure.">
          <NebulaIncubation goals={[
            { id: 'g1', label: 'Morning intention practice', progress: 0.6 },
            { id: 'g2', label: 'Boundary with team lead', progress: 0.3 },
            { id: 'g3', label: 'Joy integration daily', progress: 0.1 },
          ]} />
        </Sec>

        <Sec id="s-escape" n="24" title="Escape Velocity" desc="Breaking free from a gravitational pattern — trail tells struggle and freedom.">
          <div className="grid sm:grid-cols-2 gap-6">
            <EscapeVelocity progress={72} rayName="Joy" patternLabel="Breaking free" />
            <EscapeVelocity progress={35} rayName="Possibility" patternLabel="Building momentum" />
          </div>
        </Sec>

        <Sec id="s-flare" n="25" title="Solar Flare Journal" desc="Breakthrough timeline — flares erupt in each Ray's color.">
          <SolarFlareJournal flares={[
            { id: 'f1', rayId: 'R8', rayName: 'Ray of Possibility', label: 'Insight', date: 'Jan 15', magnitude: 0.3 },
            { id: 'f2', rayId: 'R3', rayName: 'Ray of Presence', label: 'Awareness', date: 'Jan 22', magnitude: 0.6 },
            { id: 'f3', rayId: 'R2', rayName: 'Ray of Joy', label: 'Breakthrough', date: 'Feb 3', magnitude: 1.0 },
            { id: 'f4', rayId: 'R4', rayName: 'Ray of Power', label: 'Action', date: 'Feb 10', magnitude: 0.7 },
            { id: 'f5', rayId: 'R5', rayName: 'Ray of Purpose', label: 'Clarity', date: 'Feb 18', magnitude: 0.5 },
          ]} />
        </Sec>

        <Sec id="s-depth" n="26" title="Photosphere Depth" desc="Sun cross-section showing self-awareness layers — surface habits to authentic core.">
          <div className="grid sm:grid-cols-2 gap-6">
            <PhotosphereDepth depth={45} />
            <PhotosphereDepth depth={85} />
          </div>
        </Sec>

        <Sec id="s-binary" n="27" title="Binary Star Partnership" desc="Relationship visualization — aligned infinity loop vs drifting widening orbits.">
          <BinaryStarPartnership alignment={78} />
        </Sec>

        <Sec id="s-background" n="28" title="Cosmic Background Radiation" desc="Baseline energy heat map — seven days of ambient energy on the purple canvas.">
          <CosmicBackground dailyEnergy={[
            { day: 'Mon', level: 30 }, { day: 'Tue', level: 45 }, { day: 'Wed', level: 62 },
            { day: 'Thu', level: 85 }, { day: 'Fri', level: 70 }, { day: 'Sat', level: 55 }, { day: 'Sun', level: 48 },
          ]} />
        </Sec>

        {/* ── How It Works ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl mb-4 uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-gold)', letterSpacing: '0.04em' }}>How It Works</h2>
            <p className="text-base max-w-lg mx-auto mb-12" style={{ color: 'var(--text-on-dark)', lineHeight: 1.6 }}>
              The 143 Assessment maps your energy across nine Rays of leadership capacity.
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { step: '01', title: 'Take the Assessment', desc: 'Answer honest questions about your current leadership patterns.' },
                { step: '02', title: 'See Your Rays', desc: 'Get a personalized map of your nine Rays.' },
                { step: '03', title: 'Build Capacity', desc: 'Use daily reps and targeted practices to expand what is eclipsed.' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="glass-card p-6 text-left"
                  style={{ border: '1.5px solid #60058D' }}
                >
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ background: 'var(--brand-gold)', color: '#020202' }}
                  >
                    Step {item.step}
                  </span>
                  <h3 className="text-base font-semibold mb-2 uppercase" style={{ color: 'var(--brand-gold)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-on-dark)', lineHeight: 1.55 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 text-center" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <p className="text-sm uppercase tracking-[0.12em] mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-gold)' }}>143 Leadership</p>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>Cosmic Assessment — All 28 Components</p>
      </footer>
    </div>
  );
}

function Sec({ id, n, title, desc, children }: { id: string; n: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-12 sm:py-16 px-4 sm:px-6" aria-labelledby={`${id}-h`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="block h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold))' }} />
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--brand-gold)' }}>{n}</p>
            <span className="block h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg, var(--brand-gold), transparent)' }} />
          </div>
          <h2 id={`${id}-h`} className="text-2xl sm:text-3xl mb-3 uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-gold)', letterSpacing: '0.04em' }}>{title}</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-on-dark)', lineHeight: 1.6 }}>{desc}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function CatHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-center">
      <div className="flex items-center gap-4 mb-5">
        <span className="block h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold))' }} />
        <span className="block h-px flex-1" style={{ background: 'linear-gradient(90deg, var(--brand-gold), transparent)' }} />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-on-dark)' }}>{sub}</p>
      <h2 className="text-3xl sm:text-4xl uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-gold)', letterSpacing: '0.04em' }}>{title}</h2>
    </div>
  );
}
