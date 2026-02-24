import type { Metadata } from "next";

import ArchetypeLibraryClient from "@/components/archetypes/ArchetypeLibraryClient";

export const metadata: Metadata = {
  title: "36 Light Signatures | 143 Leadership",
  description:
    "Browse all 36 Light Signatures — trainable leadership patterns mapped by the 143 Assessment. Find yours, explore others, and understand what each combination creates.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "36 Light Signatures | 143 Leadership",
    description:
      "Browse all 36 Light Signatures. Discover how your top two rays combine into a unique leadership pattern.",
  },
};

export default function ArchetypesPage() {
  return (
    <main
      className="min-h-screen px-4 py-12 sm:py-16"
      style={{ background: "var(--bg-deep)" }}
    >
      <div className="mx-auto max-w-6xl">
        <ArchetypeLibraryClient />
      </div>
    </main>
  );
}
