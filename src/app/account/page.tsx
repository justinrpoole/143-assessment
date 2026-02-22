import { AccountBillingClient } from "@/components/billing/AccountBillingClient";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getEntitlementByUserId } from "@/lib/db/entitlements";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const auth = await getRequestAuthContext();
  const entitlement = auth.userId
    ? await getEntitlementByUserId(auth.userId).catch(() => null)
    : null;
  const effectiveState = entitlement?.user_state ?? auth.userState;

  emitPageView({
    eventName: "page_view_account",
    sourceRoute: "/account",
    userState: effectiveState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Account</p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Manage Your Account
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            View your subscription status, manage billing, and access your assessment history.
            Your data stays even if you cancel — when you come back, your map is waiting.
          </p>
        </header>

        <AccountBillingClient
          userState={effectiveState}
          hasStripeCustomer={Boolean(entitlement?.stripe_customer_id)}
        />
      </div>
    </main>
  );
}
