// TODO: Remove this preview page after design review
import PortalPreviewClient from "./PortalPreviewClient";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";

export const metadata = {
  title: "Portal Preview — 143 Leadership OS",
};

export default function PortalPreviewPage() {
  return (
    <div
      className="min-h-screen px-4 py-8 max-w-2xl mx-auto"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #1A0A2E 0%, #0D0520 70%, #020002 100%)",
      }}
    >
      <RadialSpotlight>
        <RaySpectrumStrip className="mb-6" />
        <CosmicErrorBoundary sectionLabel="PORTAL-PREVIEW">
          <PortalPreviewClient />
        </CosmicErrorBoundary>
      </RadialSpotlight>
    </div>
  );
}
