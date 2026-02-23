import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EveningReflectionClient from "@/components/retention/EveningReflectionClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Evening Reflection — 143 Leadership OS",
};

export default async function ReflectPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/reflect",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <PageShell>
      <PageHeader title="Evening Reflection" />

      <div className="mt-6">
        <EveningReflectionClient />
      </div>
    </PageShell>
  );
}
