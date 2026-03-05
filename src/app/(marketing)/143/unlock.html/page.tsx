import { redirect } from "next/navigation";

type PageSearchParams = Record<string, string | string[] | undefined>;

interface LegacyUnlockHtmlPageProps {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
}

async function resolveSearchParams(
  value: LegacyUnlockHtmlPageProps["searchParams"],
): Promise<PageSearchParams> {
  if (!value) return {};
  if (typeof (value as Promise<PageSearchParams>).then === "function") {
    return (await value) ?? {};
  }
  return value;
}

function extractToken(params: PageSearchParams): string {
  const raw = params.token;
  if (Array.isArray(raw)) {
    return raw[0]?.trim() || "";
  }
  return typeof raw === "string" ? raw.trim() : "";
}

export default async function Legacy143UnlockHtmlPage({
  searchParams,
}: LegacyUnlockHtmlPageProps) {
  const resolved = await resolveSearchParams(searchParams);
  const token = extractToken(resolved);
  const destination = token
    ? `/143/unlock?token=${encodeURIComponent(token)}`
    : "/143/unlock";
  redirect(destination);
}
