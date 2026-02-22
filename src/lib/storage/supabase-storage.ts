const DEFAULT_SIGNED_URL_EXPIRY_SECONDS = 60 * 60;

interface StorageConfig {
  baseUrl: string;
  serviceRoleKey: string;
}

function getStorageConfig(): StorageConfig | null {
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

function authHeaders(serviceRoleKey: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: serviceRoleKey };
  // Legacy JWT keys start with "eyJ"; new sb_ keys are not JWTs
  // and must NOT be sent in the Authorization: Bearer header.
  if (serviceRoleKey.startsWith("eyJ")) {
    headers["Authorization"] = `Bearer ${serviceRoleKey}`;
  }
  return headers;
}

export async function uploadBytes(params: {
  bucket: string;
  path: string;
  contentType: string;
  bytes: Uint8Array | Buffer;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getStorageConfig();
  if (!config) {
    return { ok: false, error: "storage_not_configured" };
  }

  const objectPath = params.path.replace(/^\/+/, "");
  const url = new URL(
    `/storage/v1/object/${encodeURIComponent(params.bucket)}/${objectPath}`,
    config.baseUrl,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...authHeaders(config.serviceRoleKey),
      "Content-Type": params.contentType,
      "x-upsert": "true",
    },
    body: params.bytes as unknown as BodyInit,
  });

  if (!response.ok) {
    const details = await response.text();
    return {
      ok: false,
      error: `storage_upload_failed:${response.status}:${details.slice(0, 240)}`,
    };
  }

  return { ok: true };
}

export async function getSignedUrl(params: {
  bucket: string;
  path: string;
  expiresSeconds?: number;
}): Promise<
  | { ok: true; signedUrl: string; expiresSeconds: number }
  | { ok: false; error: string }
> {
  const config = getStorageConfig();
  if (!config) {
    return { ok: false, error: "storage_not_configured" };
  }

  const objectPath = params.path.replace(/^\/+/, "");
  const expiresSeconds =
    params.expiresSeconds ?? DEFAULT_SIGNED_URL_EXPIRY_SECONDS;
  const url = new URL(
    `/storage/v1/object/sign/${encodeURIComponent(params.bucket)}/${objectPath}`,
    config.baseUrl,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...authHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expiresIn: expiresSeconds,
    }),
  });

  const raw = await response.text();
  let parsed: { signedURL?: string } | null = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw) as { signedURL?: string };
    } catch {
      parsed = null;
    }
  }

  if (!response.ok || !parsed?.signedURL) {
    return {
      ok: false,
      error: `storage_sign_failed:${response.status}:${raw.slice(0, 240)}`,
    };
  }

  const signedUrl = parsed.signedURL.startsWith("http")
    ? parsed.signedURL
    : new URL(parsed.signedURL, config.baseUrl).toString();

  return { ok: true, signedUrl, expiresSeconds };
}
