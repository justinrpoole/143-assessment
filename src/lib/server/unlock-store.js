const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function getGlobalStore() {
  if (!globalThis.__challengeUnlockStore) {
    globalThis.__challengeUnlockStore = {
      tokenMap: new Map(),
      codeMap: new Map(),
    };
  }
  return globalThis.__challengeUnlockStore;
}

function now() {
  return Date.now();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanupExpired() {
  const store = getGlobalStore();
  const timestamp = now();

  for (const [token, record] of store.tokenMap.entries()) {
    if (!record || record.expiresAt <= timestamp) {
      store.tokenMap.delete(token);
      if (record?.codeKey) {
        store.codeMap.delete(record.codeKey);
      }
    }
  }
}

export function saveUnlockRecord({
  token,
  code,
  email,
  source = "143",
  redirect = "/143",
  unlockUrl,
  pdfUrl,
  ttlMs = DEFAULT_TTL_MS,
}) {
  cleanupExpired();

  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = String(code || "").trim().toUpperCase();
  const tokenValue = String(token || "").trim();
  const codeKey = `${normalizedEmail}::${normalizedCode}`;

  const record = {
    token: tokenValue,
    code: normalizedCode,
    email: normalizedEmail,
    source,
    redirect,
    unlockUrl,
    pdfUrl,
    createdAt: now(),
    expiresAt: now() + ttlMs,
    codeKey,
  };

  const store = getGlobalStore();
  store.tokenMap.set(tokenValue, record);
  store.codeMap.set(codeKey, record);

  return record;
}

export function findByToken(token) {
  cleanupExpired();
  if (!token) return null;
  const store = getGlobalStore();
  return store.tokenMap.get(String(token).trim()) || null;
}

export function findByCode({ code, email }) {
  cleanupExpired();
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) return null;

  const store = getGlobalStore();
  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail) {
    return store.codeMap.get(`${normalizedEmail}::${normalizedCode}`) || null;
  }

  // Fallback for code-only lookup in dev mode: if unique code exists, allow it.
  const matches = [];
  for (const record of store.tokenMap.values()) {
    if (record.code === normalizedCode) matches.push(record);
  }
  return matches.length === 1 ? matches[0] : null;
}

export function buildCodeFromToken(token) {
  return String(token || "").slice(-6).toUpperCase();
}

export function createEmailHint(email) {
  const [user = "", domain = ""] = normalizeEmail(email).split("@");
  if (!domain) return "";
  const lead = user.slice(0, 1);
  return `${lead}***@${domain}`;
}
