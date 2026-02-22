"use client";

import { useEffect } from "react";
import { detectBrowserTimezone } from "@/lib/timezone";

const STORAGE_KEY = "143_tz_synced";

/**
 * Silent component that detects the browser timezone and syncs it to the
 * user's profile on first visit (or when timezone changes due to travel).
 * Renders nothing.
 */
export default function TimezoneSync() {
  useEffect(() => {
    const tz = detectBrowserTimezone();
    const lastSynced = localStorage.getItem(STORAGE_KEY);

    // Skip if already synced with this timezone
    if (lastSynced === tz) return;

    void fetch("/api/user/timezone", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone: tz }),
    }).then((res) => {
      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, tz);
      }
    }).catch(() => {
      // Silent failure — will retry on next page load
    });
  }, []);

  return null;
}
