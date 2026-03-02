import WatchMeGateClient from "./WatchMeGateClient";

export const dynamic = "force-dynamic";

export default function WatchMePage() {
  return (
    <main className="cosmic-page-bg min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(transparent 0px, rgba(0,0,0,0.03) 1px, transparent 2px)" }} />
        <p className="text-xs uppercase tracking-[0.18em] relative z-10" style={{ color: "#F8D011", fontFamily: "var(--font-cosmic-display)" }}>Internal ignition tool</p>
        <h1 className="text-3xl sm:text-5xl font-bold relative z-10" style={{ color: "#25F6FF", fontFamily: "var(--font-cosmic-display)" }}>
          Watch Me. Two words that change everything.
        </h1>
        <div className="relative z-10">
          <WatchMeGateClient />
        </div>
      </section>
    </main>
  );
}
