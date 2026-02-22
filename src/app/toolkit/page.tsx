import { ToolkitDeliveryClient } from "@/components/retention/ToolkitDeliveryClient";
import ToolkitClient from "@/components/retention/ToolkitClient";
import PortalTabBar from "@/components/portal/PortalTabBar";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";

export const dynamic = "force-dynamic";

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
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Tool Library</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
            13 protocols. Each one trains a specific Ray. Each one backed by peer-reviewed research. Each one is a rep.
          </p>
        </header>

        <div className="mt-6 space-y-8">
          <ToolkitClient />
          <ToolkitDeliveryClient isAuthenticated={auth.isAuthenticated} />
        </div>
      </div>
      <PortalTabBar />
    </main>
  );
}
