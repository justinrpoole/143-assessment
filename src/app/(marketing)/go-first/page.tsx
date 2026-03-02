import NeonGlowButton from "@/components/marketing/NeonGlowButton";

export const dynamic = "force-dynamic";

export default function GoFirstPage() {
  return (
    <main className="cosmic-page-bg min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(transparent 0px, rgba(0,0,0,0.03) 1px, transparent 2px)" }} />
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#F8D011", fontFamily: "var(--font-cosmic-display)" }}>Activation move</p>
        <h1 className="text-3xl sm:text-5xl font-bold" style={{ color: "#25F6FF", fontFamily: "var(--font-cosmic-display)" }}>
          Go First. The move that proves you trust your own light.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "var(--font-body)" }}>
          Go First means you stop waiting for perfect conditions and take one clean action that aligns with who you are becoming. You lead with evidence, not hesitation.
        </p>
        <div className="flex justify-center"><NeonGlowButton href="/assessment">Start the assessment</NeonGlowButton></div>
      </section>
    </main>
  );
}
