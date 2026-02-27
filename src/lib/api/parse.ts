/**
 * Shared JSON body parser for API routes.
 * Returns typed result or a 400 Response if the body is invalid.
 */

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

export async function parseJsonBody<T = Record<string, unknown>>(
  request: Request,
): Promise<ParseResult<T>> {
  try {
    const data = (await request.json()) as T;
    if (data === null || typeof data !== "object") {
      return {
        ok: false,
        response: new Response(
          JSON.stringify({ error: "invalid_body", detail: "Expected a JSON object" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        ),
      };
    }
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "invalid_json", detail: "Could not parse request body as JSON" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    };
  }
}
