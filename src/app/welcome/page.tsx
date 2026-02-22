import WelcomeFlowClient from "@/components/onboarding/WelcomeFlowClient";

export const metadata = {
  title: "Welcome — 143 Leadership OS",
};

export default function WelcomePage() {
  return (
    <main className="cosmic-page-bg">
      <WelcomeFlowClient />
    </main>
  );
}
