import Image from "next/image";
import type { Metadata } from "next";

import GroupCoachingWaitlistForm from "./GroupCoachingWaitlistForm";
import GroupCoachingGateClient from "./GroupCoachingGateClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Light Cohort | Group Coaching with Justin Ray",
  description:
    "An 8-week, max-8-person coaching cohort with Justin Ray. Weekly calls, accountability, assessment, and direct support.",
};

export default function GroupCoachingPage() {
  return (
    <main className="cosmic-page-bg min-h-screen">
      <GroupCoachingGateClient>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--gold-primary)" }}>
            Group coaching with Justin Ray
          </p>

          <h1 className="text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-body)" }}>
            The Light Cohort
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
            I built this for people who are done performing and ready to actually change. This is not a giant
            webinar. It&apos;s me, in the room with 6–8 people, every week, for 8 weeks.
          </p>

          <div
            className="rounded-2xl border p-6"
            style={{
              background: "var(--surface-border)",
              borderColor: "color-mix(in srgb, var(--gold-primary) 20%, transparent)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 80%, transparent))" }}>
              I&apos;ll be direct, warm, and honest with you. I&apos;ll challenge patterns when they show up, and I&apos;ll stay with
              you long enough to help you build a new one.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: "var(--text-body)" }}>
              What you get
            </h2>
            <ul className="space-y-2 text-base" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
              <li>• Weekly group coaching calls with me (8 weeks)</li>
              <li>• Full 143 Assessment + your Gravitational Stability Report</li>
              <li>• Weekly Ray accountability so you actually follow through</li>
              <li>• Direct access to me between calls</li>
              <li>• Max 8 people — real depth, not surface-level talk</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="overflow-hidden rounded-2xl border"
            style={{
              borderColor: "color-mix(in srgb, var(--gold-primary) 25%, transparent)",
              background: "color-mix(in srgb, var(--text-body) 3%, transparent)",
            }}
          >
            <Image
              src="/images/justin-ray-headshot.png"
              alt="Justin Ray"
              width={1000}
              height={1200}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--gold-primary)" }}>
              8 weeks · max 8 people · deep transformation
            </p>
            <p style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
              Pricing is shared after application. I care more about fit than volume.
            </p>
          </div>

          <GroupCoachingWaitlistForm />
        </div>
      </section>
      </GroupCoachingGateClient>
    </main>
  );
}
