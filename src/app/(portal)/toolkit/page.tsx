import { ToolkitDeliveryClient } from "@/components/retention/ToolkitDeliveryClient";
import ToolkitClient from "@/components/retention/ToolkitClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tool Library",
  description: "13 protocols. Each one trains a specific Ray. Each one backed by peer-reviewed research. Each one is a rep.",
};

export default async function ToolkitPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_toolkit",
    sourceRoute: "/toolkit",
    userState: auth.userState,
    userId: auth.userId,
  });
  emitEvent({
    eventName: "toolkit_view",
    sourceRoute: "/toolkit",
    userState: auth.userState,
    userId: auth.userId,
    extra: {
      toolkit_version: "v2",
    },
  });

  return (
    <>
      <PageHeader
        title="Tool Library"
        description="13 protocols. Each one trains a specific Ray. Each one backed by peer-reviewed research. Each one is a rep."
      />
      <GoldDividerAnimated />

      <div className="mt-6 space-y-8">
        <ToolkitClient />
        <ToolkitDeliveryClient isAuthenticated={auth.isAuthenticated} />
      </div>
    </>
  );
}
