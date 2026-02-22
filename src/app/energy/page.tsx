import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EnergyAuditClient from "@/components/retention/EnergyAuditClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Energy Audit — 143 Leadership OS",
};

export default async function EnergyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/energy",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Daily Practice</p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Energy Audit
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Track where your energy goes each day. The audit helps you see patterns —
            which activities fuel you, which drain you, and where eclipse is creeping in
            before you notice it. Over time, this log becomes your most honest mirror.
          </p>
        </header>

        <div className="mt-6">
          <EnergyAuditClient />
        </div>
      </div>
    </main>
  );
}
