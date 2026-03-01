import type { Metadata } from "next";
import Link from "next/link";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/ui/FadeInSection";
import { rayHex } from "@/lib/ui/ray-colors";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The 13 Tools — 143 Leadership",
  description: "13 protocols. Each one trains a specific leadership capacity. Each one backed by research. Each one is a rep.",
};

const TOOLS = [
  { num: "01", name: "Watch Me",           ray: "R3", rayName: "Presence",      body: "You freeze. This moves you. Watch Me is the practice that proves you can start before you're ready." },
  { num: "02", name: "Go First",            ray: "R4", rayName: "Power",         body: "Confidence comes after the action, not before. Go First rewires the sequence." },
  { num: "03", name: "Be The Light",        ray: "R9", rayName: "Be The Light",  body: "You are the environment. Before you say a word, your light or your eclipse is already in the room." },
  { num: "04", name: "Morning Mirror",      ray: "R1", rayName: "Intention",     body: "Set the filter before the day sets it for you. Three minutes. One question. Whole different day." },
  { num: "05", name: "Joy Signal",          ray: "R2", rayName: "Joy",           body: "Train your system to notice what is actually good. The RAS finds what you point it at." },
  { num: "06", name: "Pattern Interrupt",   ray: "R3", rayName: "Presence",      body: "Break the loop before it breaks you. Interrupt the automated response and choose differently." },
  { num: "07", name: "Micro Joy",           ray: "R2", rayName: "Joy",           body: "60 seconds. One honest good thing. Small inputs compound into a fundamentally different filter." },
  { num: "08", name: "Eclipse Check",       ray: "ALL", rayName: "All Rays",     body: "See what is covering your light today. Three questions that reveal your current load." },
  { num: "09", name: "Evening Reflection",  ray: "R6", rayName: "Authenticity",  body: "End the day as yourself — not as the person the day made you. Close the loop." },
  { num: "10", name: "If/Then Plan",        ray: "R5", rayName: "Purpose",       body: "Wire the intention into the moment. When X happens, I will do Y. That is a rep that sticks." },
  { num: "11", name: "Deep Listening Rep",  ray: "R7", rayName: "Connection",    body: "Full presence as a practice. You cannot connect at the level you are capable of while distracted." },
  { num: "12", name: "Possibility Scan",    ray: "R8", rayName: "Possibility",   body: "What you are not seeing yet. Expand the aperture. Most decisions are made inside a too-small frame." },
  { num: "13", name: "Energy Audit",        ray: "ALL", rayName: "All Rays",     body: "Where your light is going right now. This one shows you the leak before the collapse." },
];

export default async function ToolsPage() {
  const userState = await getUserStateFromRequest();
  emitPageView({ eventName: "page_view_tools", sourceRoute: "/tools", userState });

  return (
    <main className="cosmic-page-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${rayHex("R5")} 0%, transparent 70%)` }} />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <FadeInSection>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>The Tool Library</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
              13 protocols.<br />Each one is a rep.
            </h1>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>
              Every tool in this library trains a specific leadership capacity. Not theory. Not a worksheet. A rep — a deliberate action that changes your wiring over time.
            </p>
            <p className="mt-4 text-sm font-semibold" style={{ color: rayHex("R1") }}>
              Take the free assessment to unlock your personalized tool sequence.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <LiquidFillButton href="/assessment">Take the Free Assessment</LiquidFillButton>
              <NeonGlowButton href="/preview">Check My Stability First</NeonGlowButton>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto max-w-5xl px-5 pb-8 sm:px-8">
        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <StaggerItem key={tool.num}>
              <div className="glass-card h-full rounded-2xl p-5" style={{ borderTop: `2px solid ${tool.ray === "ALL" ? rayHex("R9") : rayHex(tool.ray)}` }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold opacity-40" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>{tool.num}</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${tool.ray === "ALL" ? rayHex("R9") : rayHex(tool.ray)}22`, color: tool.ray === "ALL" ? rayHex("R9") : rayHex(tool.ray) }}>
                    {tool.rayName}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>{tool.name}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>{tool.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8">
        <FadeInSection>
          <div className="rounded-2xl border p-10" style={{ background: "rgba(255,255,255,0.03)", borderColor: `${rayHex("R1")}33` }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>Your Personalized Sequence</p>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>The assessment tells you which tool to use first.</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>
              Using the wrong tool at the wrong time is just noise. Your 9-Ray scores and Eclipse Snapshot reveal exactly which capacity needs training — and in what order.
            </p>
            <div className="mt-6">
              <LiquidFillButton href="/assessment">Take the Free Assessment →</LiquidFillButton>
            </div>
          </div>
        </FadeInSection>
      </section>
    </main>
  );
}
