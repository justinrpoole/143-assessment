/**
 * Identity Language System — "You ARE" Messaging
 *
 * Research: Identity-based language ("I am a runner") creates 2.7x habit
 * retention vs goal-based ("I want to run"). Source: James Clear, Atomic Habits.
 *
 * 143 has the infrastructure (36 archetypes, 9 rays) but daily practice
 * language was task-oriented, not identity-reinforcing. This fixes that.
 */

/** Welcome messages keyed by streak bracket */
export function portalWelcome(streakDays: number): string {
  if (streakDays === 0) {
    return "Your practice starts now. One rep. One loop. That's all it takes.";
  }
  if (streakDays <= 3) {
    return "You're showing up. That's not luck — that's a choice becoming a pattern.";
  }
  if (streakDays <= 7) {
    return "A week of practice. Your brain is starting to expect this from you.";
  }
  if (streakDays <= 14) {
    return "Two weeks in. You're not building a habit — you're proving an identity.";
  }
  if (streakDays <= 30) {
    return "Your practice is becoming automatic. The neural pathways are locked in.";
  }
  if (streakDays <= 66) {
    return "You are a practitioner. Not because of a title — because of your reps.";
  }
  return "You embody this work. The light doesn't come from outside — it IS you.";
}

/** Rep completion messages — identity-reinforcing, not praise */
export function repCompletionMessage(totalReps: number): string {
  if (totalReps === 1) {
    return "First rep. Every transformation starts here.";
  }
  if (totalReps <= 5) {
    return "Another rep in the bank. Your brain is rewriting its predictions.";
  }
  if (totalReps <= 20) {
    return "Double-digit reps. You're not trying anymore — you're training.";
  }
  if (totalReps <= 50) {
    return "Your rep count is building compound interest. This is how identity shifts.";
  }
  return "You don't do reps because you're disciplined. You do them because you're you.";
}

/** Growth detection messages — when retake shows improvement */
export function growthMessage(pointsGained: number, rayName: string): string {
  if (pointsGained <= 3) {
    return `You grew ${pointsGained} points in ${rayName}. Small shifts. Real rewiring.`;
  }
  if (pointsGained <= 8) {
    return `+${pointsGained} in ${rayName}. That's not luck — that's who you're becoming.`;
  }
  return `${pointsGained} points in ${rayName}. Your practice is showing up in your data.`;
}

/** Streak recovery messages — warm, not punishing */
export function streakRecoveryMessage(
  missedDays: number,
  previousStreak: number,
): string {
  if (missedDays === 1) {
    return `You missed yesterday. That's human. Your ${previousStreak}-day streak is waiting. One rep brings it back.`;
  }
  if (missedDays <= 3) {
    return `${missedDays} days away. The practice didn't forget you. Pick up where you left off.`;
  }
  if (missedDays <= 7) {
    return "A few days off. That's not failure — it's a reset. Your light doesn't expire.";
  }
  if (missedDays <= 30) {
    return "You've been away. Welcome back. The light doesn't forget who feeds it.";
  }
  return "It's been a while. That's okay. You're here now. That's the only rep that matters.";
}
