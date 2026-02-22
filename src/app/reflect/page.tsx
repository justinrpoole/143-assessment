import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EveningReflectionClient from "@/components/retention/EveningReflectionClient";

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
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Evening Reflection</h1>
        </header>

        <div className="mt-6">
          <EveningReflectionClient />
        </div>
      </div>
    </main>
  );
}
