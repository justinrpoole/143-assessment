import { redirect } from "next/navigation";

import { emitPageView } from "@/lib/analytics/emitter";
import { PAGE_VIEW_EVENTS } from "@/lib/analytics/taxonomy";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

type DashboardSearchParams = Record<string, string | string[] | undefined>;

interface DashboardPageProps {
  searchParams?: Promise<DashboardSearchParams> | DashboardSearchParams;
}

async function resolveSearchParams(
  value: DashboardPageProps["searchParams"],
): Promise<DashboardSearchParams> {
  if (!value) {
    return {};
  }

  if (typeof (value as Promise<DashboardSearchParams>).then === "function") {
    return (await value) ?? {};
  }

  return value;
}

function appendParam(
  target: URLSearchParams,
  key: string,
  value: string | string[] | undefined,
): void {
  if (typeof value === "undefined") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      target.append(key, item);
    }
    return;
  }

  target.set(key, value);
}

function buildRedirectPath(
  destination: "/login" | "/portal",
  searchParams: DashboardSearchParams,
): string {
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    appendParam(nextParams, key, value);
  }

  const query = nextParams.toString();
  return query ? `${destination}?${query}` : destination;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const userState = await getUserStateFromRequest();
  const resolvedSearchParams = await resolveSearchParams(searchParams);

  if (PAGE_VIEW_EVENTS.includes("page_view_dashboard")) {
    emitPageView({
      eventName: "page_view_dashboard",
      sourceRoute: "/dashboard",
      userState,
      entrySource: "/dashboard",
    });
  }

  // Matrix rule: /dashboard is redirect-only and must send traffic to /portal.
  if (userState === "public") {
    redirect(buildRedirectPath("/login", resolvedSearchParams));
  }

  redirect(buildRedirectPath("/portal", resolvedSearchParams));
}
