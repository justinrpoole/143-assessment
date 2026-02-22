import { randomUUID } from "crypto";

import type { UserState } from "@/lib/auth/user-state";
import { APP_EVENTS, PAGE_VIEW_EVENTS } from "@/lib/analytics/taxonomy";
import type {
  AppEvent,
  PageViewEvent,
  PageViewPayload,
  SetupContextScope,
  SetupSubmitPayload,
} from "@/lib/analytics/taxonomy";

const PAGE_VIEW_EVENT_SET = new Set<string>(PAGE_VIEW_EVENTS);
const APP_EVENT_SET = new Set<string>(APP_EVENTS);
const SCHEMA_VERSION = 1;
const APP_VERSION = "phase1-shell";

function assertPageViewEvent(eventName: string): asserts eventName is PageViewEvent {
  if (!PAGE_VIEW_EVENT_SET.has(eventName)) {
    throw new Error(`Unsupported page view event: ${eventName}`);
  }
}

function assertAppEvent(eventName: string): asserts eventName is AppEvent {
  if (!APP_EVENT_SET.has(eventName)) {
    throw new Error(`Unsupported app event: ${eventName}`);
  }
}

export function emitPageView(params: {
  eventName: PageViewEvent;
  sourceRoute: string;
  userState: UserState;
  userId?: string | null;
  entrySource?: string;
}): PageViewPayload {
  assertPageViewEvent(params.eventName);

  const payload: PageViewPayload = {
    event_name: params.eventName,
    event_ts_utc: new Date().toISOString(),
    source_route: params.sourceRoute,
    user_id: params.userId ?? null,
    session_id: randomUUID(),
    user_state: params.userState,
    app_version: APP_VERSION,
    schema_version: SCHEMA_VERSION,
    entry_source: params.entrySource ?? "direct",
  };

  console.info("[event]", JSON.stringify(payload));

  return payload;
}

export function emitSetupSubmit(params: {
  sourceRoute: string;
  userState: UserState;
  userId?: string | null;
  draftId: string;
  runBindingKey: string;
  contextScope: SetupContextScope;
  focusTarget: string;
  firstRep: string;
}): SetupSubmitPayload {
  assertAppEvent("setup_submit");

  const payload: SetupSubmitPayload = {
    event_name: "setup_submit",
    event_ts_utc: new Date().toISOString(),
    source_route: params.sourceRoute,
    user_id: params.userId ?? null,
    session_id: randomUUID(),
    user_state: params.userState,
    app_version: APP_VERSION,
    schema_version: SCHEMA_VERSION,
    draft_id: params.draftId,
    run_binding_key: params.runBindingKey,
    context_scope: params.contextScope,
    focus_target: params.focusTarget,
    first_rep: params.firstRep,
  };

  console.info("[event]", JSON.stringify(payload));

  return payload;
}

export function emitEvent(params: {
  eventName: string;
  sourceRoute: string;
  userState: UserState;
  userId?: string | null;
  extra?: Record<string, unknown>;
}) {
  const payload = {
    event_name: params.eventName,
    event_ts_utc: new Date().toISOString(),
    source_route: params.sourceRoute,
    user_id: params.userId ?? null,
    session_id: randomUUID(),
    user_state: params.userState,
    app_version: APP_VERSION,
    schema_version: SCHEMA_VERSION,
    ...(params.extra ?? {}),
  };

  console.info("[event]", JSON.stringify(payload));

  return payload;
}
