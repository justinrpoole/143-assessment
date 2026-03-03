import WatchMeGateClient from "./WatchMeGateClient";

export const dynamic = "force-dynamic";

export default function WatchMePage() {
  return (
    <main className="cosmic-page-bg min-h-screen">
      <section className="content-wrap--wide px-6 py-16 sm:py-24 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(transparent 0px, color-mix(in srgb, var(--ink-950) 3%, transparent) 1px, transparent 2px)" }} />
        <p className="text-xs uppercase tracking-[0.18em] relative z-10" style={{ color: "var(--gold-primary)", fontFamily: "var(--font-cosmic-display)" }}>Internal ignition tool</p>
        <h1 className="text-3xl sm:text-5xl font-bold relative z-10" style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-cosmic-display)" }}>
          Watch Me. Two words that change everything.
        </h1>
        <div className="relative z-10">
          <WatchMeGateClient />
        </div>
      </section>
    </main>
  );
}
