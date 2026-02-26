import { AccountBillingClient } from "@/components/billing/AccountBillingClient";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getEntitlementByUserId } from "@/lib/db/entitlements";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Account",
  description: "Manage your 143 Leadership subscription, billing, and account settings.",
};

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
    <>
      <PageHeader
        label="Account"
        title="Manage Your Account"
        description="View your subscription status, manage billing, and access your assessment history. Your data stays even if you cancel — when you come back, your map is waiting."
      />
      <GoldDividerAnimated />

      <AccountBillingClient
        userState={effectiveState}
        hasStripeCustomer={Boolean(entitlement?.stripe_customer_id)}
      />
    </>
  );
}
