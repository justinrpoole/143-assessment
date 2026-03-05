import type { Metadata } from "next";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/ui/FadeInSection";
import { rayHex } from "@/lib/ui/ray-colors";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The 3 Tools — 143",
  description: "Watch Me. Go First. Be The Light. Three practical reps from the I Love Challenge to reprogram your brain under pressure.",
};

const TOOLS = [
  { num: "01", name: "Watch Me",           ray: "R3", rayName: "Presence",      body: "You freeze. This moves you. Watch Me is the practice that proves you can start before you're ready." },
  { num: "02", name: "Go First",            ray: "R4", rayName: "Power",         body: "Confidence comes after the action, not before. Go First rewires the sequence." },
  { num: "03", name: "Be The Light",        ray: "R9", rayName: "Be The Light",  body: "You are the environment. Before you say a word, your light or your eclipse is already in the room." },
];

export default async function ToolsPage() {
  const userState = await getUserStateFromRequest();
  emitPageView({ eventName: "page_view_tools", sourceRoute: "/tools", userState });

  return (
    <main className="cosmic-page-bg page-shell min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${rayHex("R5")} 0%, transparent 70%)` }} />
        <div className="relative content-wrap--wide px-5 text-center sm:px-8">
          <FadeInSection>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>The Tool Library</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-body)" }}>
              3 tools.<br />One reprogramming system.
            </h1>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--text-on-dark-secondary, var(--text-body))" }}>
              143 means I love you. These are the three tools we use to retrain attention, restore agency, and keep your signal online under pressure.
            </p>
            <p className="mt-4 text-sm font-semibold" style={{ color: rayHex("R1") }}>
              Start with the I Love Challenge workbook, then run these tools in live moments.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <NeonGlowButton href="/challenge">Start The 143 Challenge</NeonGlowButton>
              <LiquidFillButton href="/preview">Check My Stability</LiquidFillButton>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Tool grid */}
      <section className="content-wrap--wide px-5 pb-8 sm:px-8">
        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <StaggerItem key={tool.num}>
              <div
                className="glass-card card-border-top-accent p-5 h-full rounded-2xl"
                style={{ '--card-accent': tool.ray === "ALL" ? rayHex("R9") : rayHex(tool.ray) } as { ['--card-accent']: string }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold opacity-40" style={{ color: "var(--text-body)" }}>{tool.num}</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${tool.ray === "ALL" ? rayHex("R9") : rayHex(tool.ray)}22`, color: tool.ray === "ALL" ? rayHex("R9") : rayHex(tool.ray) }}>
                    {tool.rayName}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold" style={{ color: "var(--text-body)" }}>{tool.name}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, var(--text-body))" }}>{tool.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Bottom CTA */}
      <section className="content-wrap--wide px-5 py-16 text-center sm:px-8">
        <FadeInSection>
          <div className="rounded-2xl border p-10" style={{ background: "color-mix(in srgb, var(--text-body) 3%, transparent)", borderColor: `${rayHex("R1")}33` }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>Your Next Move</p>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-body)" }}>Use the workbook for sequence. Use the map for evidence.</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, var(--text-body))" }}>
              The challenge teaches self-love through practice. The Stability Check shows where eclipse is active so you can apply the right tool in real time.
            </p>
            <div className="mt-6">
              <LiquidFillButton href="/preview">Check My Stability →</LiquidFillButton>
            </div>
          </div>
        </FadeInSection>
      </section>
    </main>
  );
}
