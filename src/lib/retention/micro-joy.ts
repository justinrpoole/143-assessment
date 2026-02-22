const MICRO_JOY_TEMPLATES: Record<string, string[]> = {
  default: [
    "Send one appreciative message to someone who helped you this week.",
    "Take a ten-minute walk with no phone and notice three things you like.",
    "Play one song that resets your energy, then return to your next rep.",
    "Write one sentence about what went right today before you close the day.",
    "Do one five-minute reset for your workspace and keep only what you need.",
    "Make one small plan for tonight that protects tomorrow morning.",
  ],
  focus: [
    "Set a five-minute timer and finish one open task before checking messages.",
    "Choose one priority and move every other task below it for today.",
    "Turn off one distraction for 30 minutes and stay with one task.",
  ],
  energy: [
    "Drink water now and take a short movement break before your next task.",
    "Step outside for five minutes and come back with one clear next action.",
    "Choose one meal or snack today that supports steady energy.",
  ],
  connection: [
    "Reach out to one person with a direct thank-you.",
    "Ask one clarifying question in your next conversation.",
    "Follow up on one message you have been meaning to send.",
  ],
};

function seedFrom(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function resolveMicroJoySuggestion(params: {
  userId: string;
  localDate: string;
  generationIndex: number;
  category?: string | null;
}): {
  category: string;
  templateKey: string;
  suggestionText: string;
} {
  const categoryKey =
    typeof params.category === "string" && params.category in MICRO_JOY_TEMPLATES
      ? params.category
      : "default";
  const pool = MICRO_JOY_TEMPLATES[categoryKey] ?? MICRO_JOY_TEMPLATES.default;
  const seed = seedFrom(
    `${params.userId}:${params.localDate}:${categoryKey}:${params.generationIndex}`,
  );
  const index = seed % pool.length;

  return {
    category: categoryKey,
    templateKey: `${categoryKey}_${index + 1}`,
    suggestionText: pool[index] ?? pool[0] ?? "Choose one small reset and run it.",
  };
}
