import type { Metadata } from "next";
import Link from "next/link";

import { FadeInSection } from "@/components/ui/FadeInSection";
import { rayHex } from "@/lib/ui/ray-colors";
import EmailCaptureBanner from "@/components/marketing/EmailCaptureBanner";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Justin Ray Podcast — Coming Soon",
  description:
    "Real conversations about leadership, identity, and becoming who you actually are. The Justin Ray Podcast is coming. Get notified first.",
};

const ORIGIN_SPEECHES = [
  { year: "2009", title: "Jump-Start Leadership Portfolio", note: "Leadership work from 17 years ago — the thread has always been there." },
  { year: "2012", title: "Day of Silence — Capital University", note: "Speaking on identity and courage. 14 years before 143 Leadership existed." },
  { year: "2012", title: "Break the Silence", note: "The same voice. A different stage. The same conviction." },
];

const COMING_TOPICS = [
  { ray: "R1", title: "RAS Reprogramming", body: "How the filter between you and your life actually works — and how to change it without burning yourself down." },
  { ray: "R5", title: "The Eclipse Model", body: "What happens when the light you carry gets blocked — and the path back to full radiance." },
  { ray: "R6", title: "Identity vs. Performance", body: "The difference between who you are and who you show up as. Most people never close that gap." },
  { ray: "R7", title: "Leader Conversations", body: "Real people doing the 143 work. Their scores. Their stories. Their light." },
];

export default async function PodcastPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({ eventName: "page_view_podcast", sourceRoute: "/podcast", userState });

  return (
    <main className="cosmic-page-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${rayHex("R1")} 0%, transparent 70%)` }} />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <FadeInSection>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>Coming Soon</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>The Justin Ray Podcast</h1>
            <p className="mt-6 text-lg leading-relaxed sm:text-xl" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>
              Real conversations about leadership, identity, and becoming who you actually are. Not who you were told to be. Not who you perform for the room. Who you are when the filter is honest.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="https://www.youtube.com/@Justin.RayOfLight" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:opacity-80"
                style={{ borderColor: "var(--brand-gold, #F8D011)", color: "var(--brand-gold, #F8D011)" }}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                Watch Early Speeches on YouTube
              </Link>
              <Link href="/assessment" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-80" style={{ background: "var(--brand-purple, #7C3AED)" }}>
                Take the Free Assessment →
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Origin */}
      <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <FadeInSection>
          <div className="rounded-2xl border p-8" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>The Origin</p>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>This voice has been here for 17 years.</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>
              Before 143 Leadership. Before the framework. Before any of this had a name — Justin was already on stages, speaking about identity, courage, and the kind of leadership that costs you something. The podcast is the next chapter of a conversation that never stopped.
            </p>
            <div className="mt-8 space-y-4">
              {ORIGIN_SPEECHES.map((v) => (
                <div key={v.title} className="flex items-start gap-4 rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: `${rayHex("R9")}33` }}>
                  <div className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${rayHex("R1")}22`, color: rayHex("R1") }}>{v.year}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>{v.title}</p>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>{v.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="https://www.youtube.com/@Justin.RayOfLight" target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold underline underline-offset-2 transition hover:opacity-70"
                style={{ color: "var(--brand-gold, #F8D011)" }}>
                See all 14 videos on YouTube →
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Coming topics */}
      <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <FadeInSection>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>What&apos;s Coming</p>
          <h2 className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>The conversations that change how you lead.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {COMING_TOPICS.map((item) => (
              <div key={item.title} className="rounded-xl border p-5" style={{ background: "rgba(255,255,255,0.03)", borderTop: `2px solid ${rayHex(item.ray)}`, borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm font-bold" style={{ color: rayHex(item.ray) }}>{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, #C4BFA8)" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Email capture */}
      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <FadeInSection>
          <EmailCaptureBanner />
        </FadeInSection>
      </section>
    </main>
  );
}
