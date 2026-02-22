import { redirect } from "next/navigation";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_root",
    sourceRoute: "/",
    userState,
  });

  redirect("/upgrade-your-os");
}
