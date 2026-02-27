/**
 * SmartNotificationTriggers — Behavior-based push notification content.
 *
 * Research: Calm's daily reminders drove 3x retention. Behavior-based
 * triggers outperform time-based by engaging users at moments of
 * maximum relevance, not arbitrary clock intervals.
 *
 * Each trigger returns a notification payload { title, body, url, tag }.
 * The daily-nudge cron evaluates which trigger applies per user.
 */

export interface NotificationPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

/** Morning practice reminder — fires if user hasn't logged today */
export function morningReminder(): NotificationPayload {
  return {
    title: '143 Leadership',
    body: "Your light practice is waiting. One rep today keeps the signal alive.",
    url: '/portal',
    tag: '143-morning',
  };
}

/** Streak at risk — fires after 24h of no activity when streak > 0 */
export function streakAtRisk(streakDays: number): NotificationPayload {
  return {
    title: "Your streak is waiting",
    body: `${streakDays} days of showing up. That's not luck — that's who you are. One rep keeps it alive.`,
    url: '/reps',
    tag: '143-streak-risk',
  };
}

/** One rep from weekly goal */
export function almostWeeklyGoal(current: number, target: number): NotificationPayload {
  return {
    title: "One rep from your weekly goal",
    body: `You're at ${current}/${target} this week. One more and you close it out.`,
    url: '/reps',
    tag: '143-weekly-goal',
  };
}

/** Growth detected — fires when retake shows improvement */
export function growthDetected(rayName: string, delta: number): NotificationPayload {
  return {
    title: `Your ${rayName} grew`,
    body: `+${delta} points since your last assessment. That's not random. That's your reps landing.`,
    url: '/growth',
    tag: '143-growth',
  };
}

/** Eclipse rising — fires when energy audit shows high load 3+ days */
export function eclipseRising(): NotificationPayload {
  return {
    title: "Your system needs recovery",
    body: "Your load has been elevated. Recovery isn't retreat — it's the rep right now.",
    url: '/energy',
    tag: '143-eclipse',
  };
}

/** Retake reminder — fires at day 7/21/66 after assessment */
export function retakeReminder(daysSinceAssessment: number): NotificationPayload {
  const context =
    daysSinceAssessment <= 7
      ? "A week of practice. See what moved."
      : daysSinceAssessment <= 21
        ? "Three weeks of reps. Your light signature may have shifted."
        : "66 days — the habit threshold. Time to measure your growth.";

  return {
    title: "Time for a retake",
    body: context,
    url: '/assessment/setup',
    tag: '143-retake',
  };
}

/** First-rep nudge — fires 4 hours after first assessment if no rep logged */
export function firstRepNudge(): NotificationPayload {
  return {
    title: "Your first rep is waiting",
    body: "You mapped your light. Now train it. One rep today teaches your brain that change is underway.",
    url: '/reps',
    tag: '143-first-rep',
  };
}

/** Week-in-review — Sunday summary */
export function weekInReview(repsThisWeek: number, streakDays: number): NotificationPayload {
  const streakNote = streakDays > 0
    ? ` ${streakDays}-day streak and counting.`
    : '';

  return {
    title: "Your week in review",
    body: `${repsThisWeek} rep${repsThisWeek !== 1 ? 's' : ''} this week.${streakNote} You're building.`,
    url: '/portal',
    tag: '143-weekly-review',
  };
}

/** Smart suppression — check if user was active today */
export function shouldSuppressNotification(lastActiveToday: boolean): boolean {
  return lastActiveToday;
}

/**
 * RETAKE_REMINDER_DAYS — Days after assessment when retake reminders fire.
 * Based on Ebbinghaus spacing research and BJ Fogg's habit timeline.
 */
export const RETAKE_REMINDER_DAYS = [7, 21, 66] as const;
