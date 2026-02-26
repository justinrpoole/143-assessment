import Link from "next/link";

import { MagicLinkFormClient } from "@/components/auth/MagicLinkFormClient";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your 143 Leadership account with a secure magic link. No password needed.",
};

type SearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

async function resolveSearchParams(value: PageProps["searchParams"]): Promise<SearchParams> {
  if (!value) return {};
  if (typeof (value as Promise<SearchParams>).then === "function") {
    return (await value) ?? {};
  }
  return value;
}

const SAVE_MAP_ROUTES = new Set(["/results", "/reports"]);

export default async function LoginPage({ searchParams }: PageProps) {
  const userState = await getUserStateFromRequest();
  const resolvedParams = await resolveSearchParams(searchParams);
  const sourceRoute = typeof resolvedParams.source_route === "string" ? resolvedParams.source_route : "";
  const isSaveMap = SAVE_MAP_ROUTES.has(sourceRoute.split("?")[0]);

  emitPageView({
    eventName: "page_view_login",
    sourceRoute: "/login",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col items-center justify-center px-5 py-16 sm:px-8 sm:py-24">
        <div className="glass-card w-full p-6 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {isSaveMap ? "Save Your Map" : "Sign In"}
            </p>
            <h1 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
              {isSaveMap ? "Your Light Signature Map is ready." : "Welcome back."}
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              {isSaveMap
                ? "Enter your email to save your map and unlock your full results. We will send a secure link — no password needed."
                : "Enter your email and we will send you a secure sign-in link. No password needed."}
            </p>
          </div>

          <div className="mt-6">
            <MagicLinkFormClient />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.4))' }}>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-brand-gold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-brand-gold">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            New here?{" "}
            <Link href="/preview" className="font-semibold underline underline-offset-2 transition-colors hover:text-brand-gold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Start with the free Gravitational Stability Check
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
