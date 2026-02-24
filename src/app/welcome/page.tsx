import WelcomeFlowClient from "@/components/onboarding/WelcomeFlowClient";

export const metadata = {
  title: "Welcome — 143 Leadership OS",
  description: "Welcome to the 143 Leadership operating system. Your light is already there — this is where you learn to access it.",
};

export default function WelcomePage() {
  return (
    <main className="cosmic-page-bg">
      <WelcomeFlowClient />
    </main>
  );
}
