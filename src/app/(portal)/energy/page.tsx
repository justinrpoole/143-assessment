import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EnergyAuditClient from "@/components/retention/EnergyAuditClient";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Energy Audit — 143 Leadership OS",
  description: "Track where your energy goes each day. Map emotional, cognitive, and relational load so you can train recovery before it compounds.",
};

export default async function EnergyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_energy",
    sourceRoute: "/energy",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PageHeader
        label="Daily Practice"
        title="Energy Audit"
        description="Track where your energy goes each day. The audit helps you see patterns — which activities fuel you, which drain you, and where eclipse is creeping in before you notice it. Over time, this log becomes your most honest mirror."
      />
      <GoldDividerAnimated />

      <div className="mt-6">
        <EnergyAuditClient />
      </div>
    </>
  );
}
