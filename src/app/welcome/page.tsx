import WelcomeFlowClient from "@/components/onboarding/WelcomeFlowClient";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome — 143 Leadership OS",
  description: "Welcome to the 143 Leadership operating system. Your light is already there — this is where you learn to access it.",
};

export default async function WelcomePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_welcome",
    sourceRoute: "/welcome",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <WelcomeFlowClient />
    </main>
  );
}
