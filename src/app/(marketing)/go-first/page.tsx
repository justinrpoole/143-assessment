import NeonGlowButton from "@/components/marketing/NeonGlowButton";

export const dynamic = "force-dynamic";

export default function GoFirstPage() {
  return (
    <main className="cosmic-page-bg page-shell min-h-screen">
      <section className="content-wrap--wide px-6 py-16 sm:py-24 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(transparent 0px, color-mix(in srgb, var(--ink-950) 3%, transparent) 1px, transparent 2px)" }} />
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--gold-primary)", fontFamily: "var(--font-cosmic-display)" }}>Activation move</p>
        <h1 className="text-3xl sm:text-5xl font-bold" style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-cosmic-display)" }}>
          Go First. The move that proves you trust your own light.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--text-body) 82%, transparent)", fontFamily: "var(--font-body)" }}>
          Go First means you stop waiting for perfect conditions and take one clean action that aligns with who you are becoming. You lead with evidence, not hesitation.
        </p>
        <div className="flex justify-center"><NeonGlowButton href="/preview">Start free Stability Check → discover your next Go First rep</NeonGlowButton></div>
      </section>
    </main>
  );
}
