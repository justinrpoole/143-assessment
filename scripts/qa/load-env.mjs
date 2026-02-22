/**
 * Loads .env.local (and .env as fallback) into process.env when
 * Supabase env vars are missing. This removes the need for
 * `set -a; source .env.local; set +a` before running scripts.
 *
 * Safe to call multiple times — only loads once, and only if
 * SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL are not already set.
 *
 * Does NOT change scoring, routes, entitlements, pricing, or report output.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

let loaded = false;

export function loadEnvIfMissing() {
  if (loaded) return;
  loaded = true;

  const hasSupabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (hasSupabaseUrl) return;

  const projectRoot = resolve(process.cwd());
  const candidates = [
    resolve(projectRoot, ".env.local"),
    resolve(projectRoot, ".env"),
  ];

  for (const filePath of candidates) {
    try {
      const content = readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex < 1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        // Strip surrounding quotes
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        // Only set if not already in environment
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    } catch {
      // File doesn't exist — try next candidate.
    }
  }
}
