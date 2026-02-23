import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import WeeklyReviewClient from "@/components/retention/WeeklyReviewClient";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Weekly Review — 143 Leadership OS",
};

export default async function WeeklyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/weekly",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PageHeader title="Weekly Review" />

      <div className="mt-6">
        <WeeklyReviewClient />
      </div>
    </>
  );
}
