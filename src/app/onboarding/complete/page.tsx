import { redirect } from "next/navigation";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
export const dynamic = "force-dynamic";
export default async function OnboardingCompletePage() {
  const userState = await getUserStateFromRequest();
  redirect("/assessment/setup");
}
