/**
 * Timezone utilities for converting UTC timestamps to user-local dates.
 *
 * All date-dependent logic (streaks, daily entries, weekly counts) must use
 * these helpers to avoid off-by-one errors for non-UTC users.
 */

const DEFAULT_TIMEZONE = "UTC";

/**
 * Convert a UTC timestamp string to a local date string (YYYY-MM-DD)
 * in the given IANA timezone.
 */
export function toLocalDateIso(
  utcTimestamp: string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  try {
    const date = new Date(utcTimestamp);
    // Intl.DateTimeFormat with ca: "iso8601" produces YYYY/M/D parts
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((p) => p.type === "year")?.value ?? "2026";
    const month = parts.find((p) => p.type === "month")?.value ?? "01";
    const day = parts.find((p) => p.type === "day")?.value ?? "01";
    return `${year}-${month}-${day}`;
  } catch {
    // Fallback to UTC if timezone is invalid
    return new Date(utcTimestamp).toISOString().slice(0, 10);
  }
}

/**
 * Get the current date string (YYYY-MM-DD) in the given IANA timezone.
 */
export function nowLocalDateIso(
  timezone: string = DEFAULT_TIMEZONE,
): string {
  return toLocalDateIso(new Date().toISOString(), timezone);
}

/**
 * Get the start of the current week (Monday 00:00) as a Date object,
 * accounting for the user's timezone.
 */
export function weekStartInTimezone(
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const todayStr = nowLocalDateIso(timezone);
  const today = new Date(todayStr + "T12:00:00Z"); // noon to avoid DST issues
  const dayOfWeek = today.getUTCDay(); // 0=Sun
  const daysFromMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  today.setUTCDate(today.getUTCDate() - daysFromMon);
  return today.toISOString().slice(0, 10);
}

/**
 * Detect the browser's IANA timezone string.
 * Only call this on the client side.
 */
export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}
