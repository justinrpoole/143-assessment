import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { MicroJoyClient } from "@/components/retention/MicroJoyClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { countMicroJoyEntriesForDate } from "@/lib/db/retention";

export const dynamic = "force-dynamic";

const MAX_GENERATES_PER_DAY = 1;
const MAX_SWAPS_PER_DAY = 3;
const MAX_TOTAL_SUGGESTIONS = MAX_GENERATES_PER_DAY + MAX_SWAPS_PER_DAY;

function localDateIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function MicroJoyPage() {
  const auth = await getRequestAuthContext();
  const localDate = localDateIso();
  let dailyCount = 0;
  if (auth.userId) {
    dailyCount = await countMicroJoyEntriesForDate({
      userId: auth.userId,
      localDate,
    }).catch(() => 0);
  }

  const remainingTotal = Math.max(0, MAX_TOTAL_SUGGESTIONS - dailyCount);
  const remainingSwaps = Math.max(0, remainingTotal - (dailyCount === 0 ? 1 : 0));

  emitPageView({
    eventName: "page_view_microjoy",
    sourceRoute: "/micro-joy",
    userState: auth.userState,
    userId: auth.userId,
  });
  emitEvent({
    eventName: "microjoy_view",
    sourceRoute: "/micro-joy",
    userState: auth.userState,
    userId: auth.userId,
    extra: {
      local_date: localDate,
      remaining_generates: dailyCount === 0 ? 1 : 0,
      remaining_swaps: remainingSwaps,
    },
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Daily Practice
          </p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Micro Joy</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            One small thing that tells your RAS the world has good in it. That signal changes what your brain looks for next.
          </p>
        </header>

        <MicroJoyClient />
        <FeedbackWidget
          feedback_type="microjoy_value"
          source_route="/micro-joy"
          title="Micro Joy value check"
        />
      </div>
    </main>
  );
}
