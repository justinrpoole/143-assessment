import { redirect } from "next/navigation";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export default async function AssessmentCompletePage({ searchParams }: { searchParams: Record<string, string> }) {
  const userState = await getUserStateFromRequest();
  const runId = searchParams?.run_id;
  if (runId) redirect(`/results?run_id=${runId}`);
  redirect("/results");
}
