import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { PreviewSnapshotClient } from "@/components/retention/PreviewSnapshotClient";
import { PAGE_COPY_V1 } from "@/content/page_copy.v1";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const auth = await getRequestAuthContext();
  const copy = PAGE_COPY_V1.preview;

  emitPageView({
    eventName: "page_view_preview",
    sourceRoute: "/preview",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          {/* <!--SPINE:HOOK--> */}
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.headline}</h1>
          {/* <!--SPINE:WHY--> */}
          <p style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.why}</p>
          {/* <!--SPINE:PROOF--> */}
          <p style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.proof}</p>
          {/* <!--SPINE:HOW--> */}
          <p style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.how}</p>
          {/* <!--SPINE:OUTCOME--> */}
          <p style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.outcome}</p>
          {/* <!--SPINE:LOOP--> */}
          <p style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.loop}</p>
        </header>

        <PreviewSnapshotClient />
        <section className="glass-card mt-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Go Deeper</p>
          <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.paidTierTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.paidTierBody}</p>
        </section>
        <FeedbackWidget
          feedback_type="question_clarity"
          source_route="/preview"
          title="Quick clarity check"
        />
      </div>
    </main>
  );
}
