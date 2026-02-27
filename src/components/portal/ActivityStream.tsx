"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ActivityType = "entry" | "log" | "assessment";

interface ActivityEvent {
  id: string;
  type: ActivityType;
  label: string;
  detail: string | null;
  timestamp: string;
  date: string;
  href: string;
}

interface ActivityResponse {
  timezone: string;
  events: ActivityEvent[];
}

function typeColor(type: ActivityType): string {
  if (type === "assessment") return "var(--brand-gold)";
  if (type === "log") return "rgba(148, 80, 200, 0.9)";
  return "rgba(52, 211, 153, 0.85)";
}

function formatStamp(stamp: string): string {
  const date = new Date(stamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ActivityStream({ limit = 32 }: { limit?: number }) {
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/portal/activity-stream?limit=${limit}`);
        if (!res.ok) return;
        const json = (await res.json()) as ActivityResponse;
        if (active) setData(json);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [limit]);

  const events = useMemo(() => data?.events ?? [], [data]);

  if (loading) {
    return (
      <div className="glass-card p-5">
        <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
          Loading activity stream...
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="glass-card p-5 space-y-2">
        <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
          Activity stream
        </p>
        <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
          Your newest entries, reps, and assessment milestones will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--text-on-dark-muted)" }}>
          Activity stream
        </p>
        <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
          {events.length} recent events
        </p>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3">
            <span
              className="mt-1 h-2 w-2 rounded-full"
              style={{ background: typeColor(event.type) }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium" style={{ color: "var(--text-on-dark)" }}>
                  {event.label}
                </p>
                <span className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
                  {formatStamp(event.timestamp)}
                </span>
              </div>
              {event.detail && (
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-on-dark-secondary)" }}>
                  {event.detail}
                </p>
              )}
              <Link
                href={event.href}
                className="text-[11px] underline underline-offset-2"
                style={{ color: "var(--brand-gold)" }}
              >
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
