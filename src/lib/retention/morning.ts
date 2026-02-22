const MORNING_AFFIRMATIONS = [
  "You already know your next clear rep. Run it.",
  "One honest action today changes the whole day.",
  "Your attention is your advantage. Use it with intention.",
  "Small follow-through builds a stable operating system.",
  "You can choose clarity before urgency.",
  "Finish one meaningful action and let momentum compound.",
  "You are the type of person who keeps promises to yourself.",
];

function daySeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

import { nowLocalDateIso } from "@/lib/timezone";

export function currentLocalDateIso(): string {
  return nowLocalDateIso();
}

export function resolveDailyAffirmation(params: {
  userId: string;
  entryDate?: string;
}): string {
  const day = params.entryDate ?? nowLocalDateIso();
  const seed = daySeed(`${params.userId}:${day}`);
  const index = seed % MORNING_AFFIRMATIONS.length;
  return MORNING_AFFIRMATIONS[index] ?? MORNING_AFFIRMATIONS[0];
}
