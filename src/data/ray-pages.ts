/**
 * Ray page slugs + metadata for /rays/[slug] deep-dive pages.
 * All copy content is sourced from cosmic-copy.ts — this file
 * only handles the routing/structural data.
 */

export interface RayPageMeta {
  slug: string;
  rayId: string;
  name: string;
  phase: 'Reconnect' | 'Expand' | 'Become';
  /** Which ray IDs are in the same phase */
  relatedRays: string[];
  /** Next ray in the sequence (for navigation) */
  nextRay: string | null;
  /** Previous ray in the sequence (for navigation) */
  prevRay: string | null;
}

export const RAY_PAGES: RayPageMeta[] = [
  {
    slug: 'intention',
    rayId: 'R1',
    name: 'Intention',
    phase: 'Reconnect',
    relatedRays: ['R2', 'R3'],
    prevRay: null,
    nextRay: 'joy',
  },
  {
    slug: 'joy',
    rayId: 'R2',
    name: 'Joy',
    phase: 'Reconnect',
    relatedRays: ['R1', 'R3'],
    prevRay: 'intention',
    nextRay: 'presence',
  },
  {
    slug: 'presence',
    rayId: 'R3',
    name: 'Presence',
    phase: 'Reconnect',
    relatedRays: ['R1', 'R2'],
    prevRay: 'joy',
    nextRay: 'power',
  },
  {
    slug: 'power',
    rayId: 'R4',
    name: 'Power',
    phase: 'Expand',
    relatedRays: ['R5', 'R6'],
    prevRay: 'presence',
    nextRay: 'purpose',
  },
  {
    slug: 'purpose',
    rayId: 'R5',
    name: 'Purpose',
    phase: 'Expand',
    relatedRays: ['R4', 'R6'],
    prevRay: 'power',
    nextRay: 'authenticity',
  },
  {
    slug: 'authenticity',
    rayId: 'R6',
    name: 'Authenticity',
    phase: 'Expand',
    relatedRays: ['R4', 'R5'],
    prevRay: 'purpose',
    nextRay: 'connection',
  },
  {
    slug: 'connection',
    rayId: 'R7',
    name: 'Connection',
    phase: 'Become',
    relatedRays: ['R8', 'R9'],
    prevRay: 'authenticity',
    nextRay: 'possibility',
  },
  {
    slug: 'possibility',
    rayId: 'R8',
    name: 'Possibility',
    phase: 'Become',
    relatedRays: ['R7', 'R9'],
    prevRay: 'connection',
    nextRay: 'be-the-light',
  },
  {
    slug: 'be-the-light',
    rayId: 'R9',
    name: 'Be The Light',
    phase: 'Become',
    relatedRays: ['R7', 'R8'],
    prevRay: 'possibility',
    nextRay: null,
  },
];

/** Look up ray page meta by slug */
export function getRayPageBySlug(slug: string): RayPageMeta | undefined {
  return RAY_PAGES.find((r) => r.slug === slug);
}

/** All valid slugs for generateStaticParams */
export function getAllRaySlugs(): string[] {
  return RAY_PAGES.map((r) => r.slug);
}
