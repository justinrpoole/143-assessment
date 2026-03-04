import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Ready to See Your Map — 143 Leadership",
  description: "You answered all 143 questions. Your map is being calculated.",
};

export default async function AssessmentReviewPage() {
  const userState = await getUserStateFromRequest();
  emitPageView({ eventName: "assessment_review_view", sourceRoute: "/assessment/review", userState });
  return (
    <main className="cosmic-page-bg page-shell">
      <div className="content-wrap space-y-8">
        <section className="relative">
          <FloatingOrbs variant="gold" />
          <div className="glass-card p-8 sm:p-12 text-center space-y-6">
            <p className="gold-tag inline-block">143 Questions Complete</p>
            <h1 className="text-shimmer text-3xl sm:text-4xl font-bold" style={{color:'var(--text-on-dark)'}}>
              That&apos;s 143 acts of self-inquiry.
            </h1>
            <p className="text-lg max-w-lg mx-auto" style={{color:'var(--text-on-dark-secondary)'}}>
              143 means I love you. You just said that to yourself — honestly, completely, without performance.
            </p>
            <RaySpectrumStrip className="mt-4" />
            <div className="pt-4">
              <Link
                href="/assessment/scoring"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all duration-150"
                style={{ color: 'var(--bg-deep)' }}
              >
                Reveal My Map →
              </Link>
            </div>
            <p className="text-xs" style={{color:'var(--text-on-dark-secondary)'}}>
              Not a personality type. A live map of where your operating system is right now.
            </p>
          </div>
        </section>
        <RayDivider ray="R9" />
        <GoldHeroBanner kicker="Your Map" title="Your operating system is ready to read." description="9 Rays. Your Eclipse pattern. Your Light Signature. Built from your honest answers." />
      </div>
    </main>
  );
}
