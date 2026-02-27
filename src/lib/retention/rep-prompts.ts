export type WatchMePrompt = {
  label: string;
  target: string;
  move: string;
};

export type GoFirstPrompt = {
  label: string;
  action: string;
};

export const WATCH_ME_PROMPTS_BY_RAY: Record<string, WatchMePrompt[]> = {
  R1: [
    { label: 'One priority', target: "Today's one priority", move: 'Write it in one sentence and start 2 minutes.' },
    { label: 'Noise -> signal', target: 'What matters before the noise', move: 'Turn on DND for 20 minutes and begin.' },
    { label: 'Decision', target: 'The decision you keep delaying', move: 'Write: "I will decide by ___."' },
  ],
  R2: [
    { label: 'Small joy', target: 'One small good thing right now', move: 'Name it and stay with it for 10 seconds.' },
    { label: 'Light moment', target: 'A moment that actually felt light', move: 'Text it to yourself or log it.' },
    { label: 'Repeatable', target: 'A tiny joy you can repeat today', move: 'Schedule it for later and protect it.' },
  ],
  R3: [
    { label: 'Come back', target: 'Where you feel scattered', move: 'Feet on floor, slow exhale, name one thing you see.' },
    { label: 'This convo', target: 'The conversation in front of you', move: 'Put the phone down for one full minute.' },
    { label: 'One task', target: 'The one task you can finish now', move: 'Close everything else and do the next step.' },
  ],
  R4: [
    { label: 'Honest line', target: 'The honest sentence you keep editing', move: 'Say it cleanly in one sentence.' },
    { label: 'First move', target: 'The first move you know you need', move: 'Do the first 60 seconds right now.' },
    { label: 'Boundary', target: 'The boundary you want to hold', move: 'Use: "I can\'t do that, but I can ___."' },
  ],
  R5: [
    { label: 'Why this matters', target: 'Why this work matters today', move: 'Write one line: "This matters because ___."' },
    { label: 'Aligned task', target: 'The task that fits what you stand for', move: 'Start it for 5 minutes.' },
    { label: 'Tradeoff', target: 'What you are choosing not to do', move: 'Name the tradeoff out loud.' },
  ],
  R6: [
    { label: 'Real answer', target: 'The real answer you softened', move: 'Say the clean version in one sentence.' },
    { label: 'Unedited', target: 'Where you edited yourself', move: 'Write what you wanted to say.' },
    { label: 'One true share', target: 'One true thing you can say today', move: 'Tell one safe person.' },
  ],
  R7: [
    { label: 'Reach out', target: 'The person you have been avoiding', move: 'Send a check-in text now.' },
    { label: 'Invite', target: 'A simple connection you want', move: 'Ask one real question.' },
    { label: 'Repair', target: 'The conversation you keep postponing', move: 'Set a 10-minute time today.' },
  ],
  R8: [
    { label: 'Small experiment', target: 'The option you keep dismissing', move: 'Name a tiny experiment and run it.' },
    { label: 'New angle', target: 'A new angle you want to try', move: 'Write one "what if" and test it.' },
    { label: 'First step', target: 'The smallest risk that opens a door', move: 'Do the first 60 seconds.' },
  ],
  R9: [
    { label: 'Make it easier', target: "Someone else's next hour", move: 'Do one thing that makes it lighter.' },
    { label: 'Go first', target: 'The example you want to set', move: 'Do it first and let it be seen.' },
    { label: 'Care move', target: 'One simple act of care', move: 'Say "I see you" and mean it.' },
  ],
};

export const DEFAULT_WATCH_ME_PROMPTS: WatchMePrompt[] = [
  { label: 'One priority', target: 'The one thing that matters today', move: 'Write it and start 2 minutes.' },
  { label: 'Refocus', target: 'The task in front of you', move: 'Close everything else and begin.' },
  { label: 'Small step', target: 'The next small step', move: 'Do it now. That counts.' },
];

export const GO_FIRST_PROMPTS_BY_RAY: Record<string, GoFirstPrompt[]> = {
  R1: [
    { label: 'Choose', action: 'Pick one priority and start 2 minutes.' },
    { label: 'Block it', action: 'Book 20 minutes for it and begin.' },
    { label: 'Decide', action: 'Make the call you keep delaying.' },
  ],
  R2: [
    { label: 'Joy rep', action: 'Do one small joy thing right now.' },
    { label: 'Name it', action: 'Name one win you usually skip past.' },
    { label: 'Repeat', action: 'Schedule a small joy for later today.' },
  ],
  R3: [
    { label: 'Presence', action: 'Put your phone down and finish one task.' },
    { label: 'One breath', action: 'Slow exhale, then start the next step.' },
    { label: 'Single-task', action: 'Do one thing all the way through.' },
  ],
  R4: [
    { label: 'Say it', action: 'Say the honest sentence now.' },
    { label: 'Start', action: 'Do the first 60 seconds.' },
    { label: 'Boundary', action: 'Use: "I can\'t do that, but I can ___."' },
  ],
  R5: [
    { label: 'Why', action: 'Write one line on why this matters.' },
    { label: 'Align', action: 'Pick the task that matches your values and start.' },
    { label: 'Tradeoff', action: 'Name what you are not doing today.' },
  ],
  R6: [
    { label: 'Truth', action: 'Say the real thing in one sentence.' },
    { label: 'Unedited', action: 'Write what you actually think.' },
    { label: 'Share', action: 'Tell one safe person one true thing.' },
  ],
  R7: [
    { label: 'Reach', action: 'Send the check-in text now.' },
    { label: 'Ask', action: 'Ask one real question.' },
    { label: 'Repair', action: 'Set a 10-minute time to talk.' },
  ],
  R8: [
    { label: 'Experiment', action: 'Run a tiny experiment today.' },
    { label: 'New angle', action: 'Try one different approach for 10 minutes.' },
    { label: 'First step', action: 'Do the first 60 seconds.' },
  ],
  R9: [
    { label: 'Go first', action: 'Do the example you want others to follow.' },
    { label: 'Make it easier', action: 'Remove one friction for someone else.' },
    { label: 'Care move', action: 'Say "I see you" and mean it.' },
  ],
};

export const DEFAULT_GO_FIRST_PROMPTS: GoFirstPrompt[] = [
  { label: 'Start', action: 'Do the first 60 seconds now.' },
  { label: 'One move', action: 'Pick one small action and complete it.' },
  { label: 'Say it', action: 'Say the honest sentence in one line.' },
];
