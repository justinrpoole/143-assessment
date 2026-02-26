import { redirect } from "next/navigation";

/**
 * /143-challenge redirects to /143 (the canonical challenge route).
 * Previous marketing content has been consolidated into /143.
 */
export const dynamic = "force-dynamic";

export default function Challenge143RedirectPage() {
  redirect("/143");
}
