// TODO: Remove this preview page after design review
import SampleReportClient from "@/components/assessment/SampleReportClient";
import PortalPreviewClient from "./PortalPreviewClient";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import RayDivider from "@/components/ui/RayDivider";

export const metadata = {
  title: "Portal Preview — 143 Leadership OS",
};

export default function PortalPreviewPage() {
  return (
    <div
      className="min-h-screen px-4 py-8 max-w-2xl mx-auto"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #1A0A2E 0%, #0D0520 70%, #020202 100%)",
      }}
    >
      <RadialSpotlight>
        <CosmicErrorBoundary sectionLabel="PORTAL-PREVIEW">
          {/* Section A: Your full report — who you are in your light */}
          <SampleReportClient />

          <RayDivider ray="R9" />

          {/* Section B: Your daily practice portal */}
          <PortalPreviewClient />
        </CosmicErrorBoundary>
      </RadialSpotlight>
    </div>
  );
}
