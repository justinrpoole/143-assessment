import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EveningReflectionClient from "@/components/retention/EveningReflectionClient";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Evening Reflection — 143 Leadership OS",
  description: "End-of-day reflection practice. Notice what you gave, what you received, and what is still in motion. The rep that trains awareness.",
};

export default async function ReflectPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_reflect",
    sourceRoute: "/reflect",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PageHeader title="Evening Reflection" />

      <div className="mt-6">
        <EveningReflectionClient />
      </div>
    </>
  );
}
