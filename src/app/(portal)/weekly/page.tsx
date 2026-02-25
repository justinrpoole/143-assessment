import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import WeeklyReviewClient from "@/components/retention/WeeklyReviewClient";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Weekly Scan — 143 Leadership OS",
  description: "Your weekly leadership snapshot. Track capacity shifts, notice patterns, and see where your operating system is updating.",
};

export default async function WeeklyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_weekly",
    sourceRoute: "/weekly",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PageHeader title="Weekly Scan" description="Your system changes. This is your weekly snapshot." />

      <div className="mt-6">
        <WeeklyReviewClient />
      </div>
    </>
  );
}
