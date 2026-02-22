// STEP4B: Archetype Matching
// Looks up the archetype for the Top Two pair code from archetype_blocks.json.

import type { ArchetypeBlock } from '../types';

/**
 * Find the archetype that matches the Top Two pair code.
 *
 * Pair codes are formatted as "R1-R5" (always lower number first).
 * The archetype data uses ray_a / ray_b fields like "R1" / "R5".
 */
export function matchArchetype(
  pairCode: string,
  archetypeBlocks: ArchetypeBlock[],
): ArchetypeBlock | null {
  if (!pairCode) return null;

  // Direct match on pair_code field
  const direct = archetypeBlocks.find((a) => a.pair_code === pairCode);
  if (direct) return direct;

  // Try matching via ray_a + ray_b
  const [rayA, rayB] = pairCode.split('-');
  if (!rayA || !rayB) return null;

  const match = archetypeBlocks.find(
    (a) => (a.ray_a === rayA && a.ray_b === rayB) ||
           (a.ray_a === rayB && a.ray_b === rayA),
  );

  return match || null;
}
