export interface SupabaseRestConfig {
  baseUrl: string;
  serviceRoleKey: string;
}

interface SupabaseRestRequest {
  restPath: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  prefer?: string;
}

export interface SupabaseRestResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

export function getSupabaseRestConfig(): SupabaseRestConfig | null {
  const baseUrl =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  if (!baseUrl || !serviceRoleKey) {
    return null;
  }

  return { baseUrl, serviceRoleKey };
}

/**
 * Build auth headers compatible with both legacy JWT keys and
 * new-format sb_secret_ / sb_publishable_ keys.
 *
 * New-format keys are NOT JWTs and must NOT be sent in the
 * Authorization: Bearer header — PostgREST rejects them with 401.
 * The `apikey` header alone is sufficient for authentication.
 */
export function buildSupabaseAuthHeaders(
  key: string,
): Record<string, string> {
  const headers: Record<string, string> = { apikey: key };
  // Legacy JWT keys start with "eyJ"; new sb_ keys do not.
  if (key.startsWith("eyJ")) {
    headers["Authorization"] = `Bearer ${key}`;
  }
  return headers;
}

function buildUrl(
  baseUrl: string,
  restPath: string,
  query: SupabaseRestRequest["query"],
): string {
  const normalizedPath = restPath.startsWith("/")
    ? restPath.slice(1)
    : restPath;
  const url = new URL(`/rest/v1/${normalizedPath}`, baseUrl);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function supabaseRestFetch<T>(
  request: SupabaseRestRequest,
): Promise<SupabaseRestResponse<T>> {
  const config = getSupabaseRestConfig();
  if (!config) {
    return {
      ok: false,
      status: 503,
      data: null,
      error: "db_not_configured",
    };
  }

  const method = request.method ?? "GET";
  const url = buildUrl(config.baseUrl, request.restPath, request.query);
  const response = await fetch(url, {
    method,
    headers: {
      ...buildSupabaseAuthHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
      ...(request.prefer ? { Prefer: request.prefer } : {}),
    },
    body: request.body === undefined ? undefined : JSON.stringify(request.body),
    cache: "no-store",
  });

  const rawText = await response.text();
  let parsed: T | null = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as T;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: parsed,
      error: rawText || `db_request_failed:${response.status}`,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: parsed,
    error: null,
  };
}
