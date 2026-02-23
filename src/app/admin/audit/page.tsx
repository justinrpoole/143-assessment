import { redirect } from "next/navigation";

import { isAdminRequest } from "@/lib/auth/admin";
import { AdminAuditClient } from "@/components/admin/AdminAuditClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Audit — 143 Leadership",
};

export default async function AdminAuditPage() {
  const admin = await isAdminRequest();
  if (!admin) {
    redirect("/");
  }

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Admin
          </p>
          <h1
            className="mt-2 text-2xl font-semibold"
            style={{ color: "var(--text-on-dark)" }}
          >
            Audit Dashboard
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Completed assessment runs with signature pair verification.
          </p>
        </header>

        <AdminAuditClient />
      </div>
    </main>
  );
}
