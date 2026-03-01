import type { Metadata } from "next";
import IlluminateDashboard from "@/components/cosmic/IlluminateDashboard";

export const metadata: Metadata = {
  title: "Light Dashboard Preview — 143 Leadership",
  description: "The 143 Leadership Light Dashboard command center.",
};

const DEMO_SCORES = {
  R1: 72, R2: 45, R3: 68, R4: 85,
  R5: 91, R6: 63, R7: 78, R8: 56, R9: 82,
};

export default function DashboardPreviewPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0E1430", padding: "24px" }}>
      <IlluminateDashboard
        scores={DEMO_SCORES}
        eclipseLevel={28}
        phase="DAWN"
      />
    </div>
  );
}
