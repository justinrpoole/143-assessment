import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { updateUserTimezone } from "@/lib/db/app-users";

interface RequestBody {
  timezone?: string;
}

// Basic validation: IANA timezone strings contain a slash (e.g. "America/New_York")
function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const timezone = body.timezone;
  if (typeof timezone !== "string" || !isValidTimezone(timezone)) {
    return NextResponse.json(
      { error: "invalid_timezone" },
      { status: 400 },
    );
  }

  try {
    await updateUserTimezone({ userId: auth.userId, timezone });
    return NextResponse.json({ timezone });
  } catch (error) {
    return NextResponse.json(
      {
        error: "timezone_update_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
