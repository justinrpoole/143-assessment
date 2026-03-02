import Image from "next/image";
import type { Metadata } from "next";

import GroupCoachingWaitlistForm from "./GroupCoachingWaitlistForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Light Cohort | Group Coaching with Justin Ray",
  description:
    "An 8-week, max-8-person coaching cohort with Justin Ray. Weekly calls, accountability, assessment, and direct support.",
};

export default function GroupCoachingPage() {
  return (
    <main className="cosmic-page-bg min-h-screen">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#F8D011" }}>
            Group coaching with Justin Ray
          </p>

          <h1 className="text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            The Light Cohort
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
            I built this for people who are done performing and ready to actually change. This is not a giant
            webinar. It&apos;s me, in the room with 6–8 people, every week, for 8 weeks.
          </p>

          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(12, 4, 22, 0.72)",
              borderColor: "rgba(248,208,17,0.2)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.8))" }}>
              I&apos;ll be direct, warm, and honest with you. I&apos;ll challenge patterns when they show up, and I&apos;ll stay with
              you long enough to help you build a new one.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
              What you get
            </h2>
            <ul className="space-y-2 text-base" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
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
              borderColor: "rgba(248, 208, 17, 0.25)",
              background: "rgba(255,255,255,0.03)",
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: "#F8D011" }}>
              8 weeks · max 8 people · deep transformation
            </p>
            <p style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
              Pricing is shared after application. I care more about fit than volume.
            </p>
          </div>

          <GroupCoachingWaitlistForm />
        </div>
      </section>
    </main>
  );
}
