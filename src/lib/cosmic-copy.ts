/**
 * Cosmic Copy Guardrails — Gravitational Stability System
 *
 * Maps assessment terminology to warm cosmic language.
 * All copy must stay flat, human, non-clinical (per CLAUDE.md canon).
 * No shame language. No labeling. No diagnosis.
 *
 * v2 — Added science-backed explanations, real-life examples,
 *       and coaching framework interventions for eclipse levels
 *       and individual rays.
 */

// ── Eclipse Labels ──────────────────────────────────────────

const ECLIPSE_LABELS: Record<string, string> = {
  LOW: 'Your system is stable. Energy is available for growth.',
  MODERATE: 'Some load near the edge — normal operating range.',
  ELEVATED: 'Your system is managing real pressure. Capacity is partially eclipsed.',
  HIGH: 'Your system is conserving energy right now. Your capacity is eclipsed, not gone.',
};

const ECLIPSE_ENCOURAGEMENTS: Record<string, string> = {
  LOW: 'Gravitational stability is high. Keep building.',
  MODERATE: 'Stay aware of your load. You have room to move.',
  ELEVATED: 'Prioritize recovery and stabilization. You are carrying weight — that is physiology, not failure.',
  HIGH: 'Everything here points toward stabilization first. Your capacity is eclipsed, not erased.',
};

export function getEclipseLabel(level: string): string {
  return ECLIPSE_LABELS[level] ?? ECLIPSE_LABELS.MODERATE;
}

export function getEclipseEncouragement(level: string): string {
  return ECLIPSE_ENCOURAGEMENTS[level] ?? ECLIPSE_ENCOURAGEMENTS.MODERATE;
}

// ── Eclipse Science + Real-Life Examples + Coaching ─────────

export interface EclipseExplanation {
  /** What the science says about this load level */
  science: string;
  /** Concrete daily-life examples the person might recognize */
  realLife: string[];
  /** Specific coaching interventions matched to this level */
  coaching: string[];
}

const ECLIPSE_EXPLANATIONS: Record<string, EclipseExplanation> = {
  LOW: {
    science:
      'Low load means your planning and regulation systems stay online. You can think clearly, recover between demands, and stay creative. This is the window where your range is widest and your reps compound fast.',
    realLife: [
      'You finish a hard conversation and still have energy for the drive home.',
      'You remember what was said in yesterday\'s meeting without checking your notes.',
      'You sit with your family at the table without reaching for your phone.',
      'A last-minute calendar change feels like a puzzle to solve, not a threat to manage.',
      'You can name what you\'re feeling before someone else has to ask.',
    ],
    coaching: [
      'This is your building window — use it. Stack micro-reps while your system has capacity.',
      'Try a progressive Intention rep: before bed, name tomorrow\'s single most important outcome. Track it for one week.',
      'Practice a 2-minute Presence anchor before your highest-stakes meeting each day.',
      'Push into a stretch zone: initiate one conversation you\'ve been postponing. Your system can hold it right now.',
    ],
  },
  MODERATE: {
    science:
      'Moderate load is a healthy challenge zone. Your system ramps up for performance and still recovers between pushes. You feel engaged and focused without feeling hijacked.',
    realLife: [
      'You handle the presentation well but feel drained by 3 PM.',
      'You\'re managing deadlines but notice you\'ve been skipping lunch.',
      'You respond to your partner\'s question — then realize you weren\'t fully listening the first time.',
      'You\'re effective in meetings but use the drive home to decompress instead of thinking clearly.',
      'You default to your strongest skill more often because it\'s easiest under pressure.',
    ],
    coaching: [
      'Monitor your recovery windows — the space between demands matters as much as the demands themselves.',
      'Build a 2-minute transition ritual between tasks: a walk to the window, three conscious breaths, or a glass of water with your eyes closed.',
      'Schedule one non-negotiable recovery block per day. Even 15 minutes of deliberate rest changes your load trajectory.',
      'Notice which ray you lean on most this week. That\'s your system compensating — not a verdict, but a signal worth tracking.',
    ],
  },
  ELEVATED: {
    science:
      'Elevated load means your system keeps the gas on between demands. Range narrows, reactivity rises, and you start borrowing energy from future days. This isn\'t a character problem — it\'s conservation.',
    realLife: [
      'You snap at a colleague over a minor question and immediately regret it.',
      'You can\'t remember whether you sent that email — or what it said.',
      'You lie awake at 2 AM rehearsing tomorrow\'s conversation.',
      'You default to your strongest ray almost exclusively because the others feel unavailable.',
      'You perform confidence at work and collapse when you get home.',
      'Small interruptions feel disproportionately large — a Slack notification derails your morning.',
    ],
    coaching: [
      'Your system is telling you something. This is physiology, not failure — and it responds to specific interventions.',
      'Start each morning with a 3-minute Presence pause before checking any screen. The first 30 minutes set your tone for the day.',
      'Reduce decision load this week: use templates, defaults, and pre-made choices wherever possible. Decision fatigue compounds energy borrowing.',
      'Name one commitment to pause temporarily. Not forever — just this week. One boundary creates space for every other capacity to recover.',
      'Try the 5-4-3-2-1 grounding technique before your next high-stakes interaction: notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
    ],
  },
  HIGH: {
    science:
      'High load is your system conserving hard. Planning and self-regulation go offline, and the gap between knowing and doing widens. This is not a verdict — it is protection. The way back is stabilization and recovery.',
    realLife: [
      'You know exactly what you should do — but you can\'t seem to do it. That gap between knowing and doing is the eclipse.',
      'You perform well in public and collapse when you walk through your front door.',
      'You can\'t access the version of yourself that used to handle this easily.',
      'Small interruptions feel like emergencies. A change in plans feels like a crisis.',
      'You\'re irritable with the people you care about most — not because you don\'t care, but because your system has nothing left to regulate with.',
      'You find yourself saying "I\'m fine" more often — and meaning it less each time.',
    ],
    coaching: [
      'Stabilization first, always. No stretch goals. No expansion work. Your system needs foundation before anything else.',
      'One thing per day — choose one: a 5-minute grounding practice, one meal eaten without a screen, or one conversation where you\'re honest about your current capacity.',
      'The most powerful coaching rep at this level is permission: permission to be where you are without performing recovery. Rest that requires effort isn\'t rest.',
      'If possible, tell one person the truth this week — not a performance of being okay, but an honest "I\'m carrying more than I can manage right now." Co-regulation is how people recover. You are not meant to stabilize alone.',
      'Retake the assessment in 30 days. When your scores move — and they will — that is proof your system responds to what you give it.',
    ],
  },
};

export function getEclipseExplanation(level: string): EclipseExplanation {
  return ECLIPSE_EXPLANATIONS[level] ?? ECLIPSE_EXPLANATIONS.MODERATE;
}

// ── Ray Labels (cosmic language) ────────────────────────────

const RAY_COSMIC_LABELS: Record<string, string> = {
  R1: 'The beam of direction — where your energy aims first.',
  R2: 'The beam of warmth — what fuels you from the inside.',
  R3: 'The beam of stillness — your capacity to hold center.',
  R4: 'The beam of force — your ability to act when it matters.',
  R5: 'The beam of alignment — where your compass points.',
  R6: 'The beam of truth — what you let the world see.',
  R7: 'The beam of reach — how deeply you connect.',
  R8: 'The beam of possibility — how far your reach extends.',
  R9: 'The beam of legacy — the impact you leave with people.',
};

export function getRayCosmicLabel(rayId: string): string {
  return RAY_COSMIC_LABELS[rayId] ?? '';
}

// ── Ray Science + Real-Life Examples + Coaching ─────────────

export interface RayExplanation {
  /** The core capacity this ray represents */
  definition: string;
  /** What the research says about this capacity */
  science: string;
  /** What it looks like when this ray is resourced */
  whenStrong: string[];
  /** What it looks like when this ray is eclipsed */
  whenEclipsed: string[];
  /** Specific micro-reps to build or recover this ray */
  coachingReps: string[];
}

const RAY_EXPLANATIONS: Record<string, RayExplanation> = {
  R1: {
    definition: 'Intention is the capacity to set clear direction and act on your top priorities before the noise arrives.',
    science:
      'When you decide in advance what you\'ll do, follow-through rises because the decision is already made. Clear if/then plans reduce decision fatigue and keep your day aligned.',
    whenStrong: [
      'You start each day knowing your single most important outcome before you open your laptop.',
      'You say no to a meeting because it doesn\'t serve this week\'s priority — and you don\'t feel guilty about it.',
      'When your plan changes, you adjust the plan rather than abandoning the intention.',
    ],
    whenEclipsed: [
      'You check email first and the day happens to you instead of for you.',
      'You finish the week busy but unsure what actually moved forward.',
      'You know your priorities intellectually but keep choosing the urgent over the important.',
    ],
    coachingReps: [
      'Tonight before bed, write one sentence: "Tomorrow, the most important thing is ___." Do this for 7 days and track what changes.',
      'Practice the Priority Pulse: at 9 AM and 2 PM, ask "Am I working on what matters most right now?" Yes or no. No judgment — just noticing.',
      'Set one implementation intention this week: "When I sit down at my desk, I will practice ___ for 25 minutes before opening email."',
    ],
  },
  R2: {
    definition: 'Joy is the capacity to access genuine positive emotion independent of external conditions.',
    science:
      'Genuine positive emotion expands attention and options — people who access micro-joy think more creatively and build resilience. This isn\'t forced positivity. It\'s your system\'s capacity to notice what is good alongside what is hard.',
    whenStrong: [
      'You catch a small moment — sunlight on the wall, your child laughing — and actually feel it instead of thinking about the next task.',
      'You celebrate a team win without immediately pivoting to the next problem.',
      'You can name three things that went well today without having to search hard for them.',
    ],
    whenEclipsed: [
      'Good things happen and you can\'t feel them — like watching a movie through glass.',
      'You achieve something and immediately think about what\'s still undone.',
      'You can\'t remember the last time you laughed without it being performative.',
    ],
    coachingReps: [
      'The Joy Noticing rep: three times today, pause for 10 seconds and name one thing — however small — that is genuinely good right now. Not conceptually good. Felt good.',
      'Before sleep, hold one specific image from the day when something worked. Not the outcome — the moment itself. Let it land for 20 seconds so it sticks.',
      'Share one good moment with another person this week, out loud. Co-experienced joy activates mirror neurons and doubles the broaden-and-build effect.',
    ],
  },
  R3: {
    definition: 'Presence is the capacity to stay with the task, the person, or the feeling in front of you without fragmenting.',
    science:
      'Attention is trainable. Each time you notice distraction and return, you build the muscle of presence. In a world of constant interruption, the rep is the return.',
    whenStrong: [
      'Someone is talking and you\'re actually hearing them — not preparing your response.',
      'You notice you\'re distracted and return to focus without self-criticism.',
      'You can sit in silence without reaching for a screen.',
    ],
    whenEclipsed: [
      'You read the same paragraph three times and still can\'t tell someone what it said.',
      'You\'re in a conversation but mentally rehearsing the next one.',
      'Your body is in the room but your mind left 20 minutes ago.',
    ],
    coachingReps: [
      'The Anchor Breath: before your next meeting, take three breaths where you feel the exhale leave your body. That\'s it. Three breaths, felt — not counted.',
      'Single-task for one 25-minute block today. No tabs, no phone, no background noise. Notice what happens in your body when you resist the pull to switch.',
      'Practice the 3-second pause: when someone finishes speaking, wait three seconds before responding. The pause itself is the rep.',
    ],
  },
  R4: {
    definition: 'Power is the capacity to identify fear and act before it argues you out of it.',
    science:
      'Courage is a trained relationship with fear. Each time you act while fear is present, the fear signal loses its grip. Power is not the absence of fear — it is movement with it.',
    whenStrong: [
      'You have the hard conversation this week instead of postponing it again.',
      'You set a boundary and follow through before fear has time to negotiate.',
      'You make the decision with 70% information instead of waiting for certainty that never comes.',
    ],
    whenEclipsed: [
      'You rehearse the confrontation but never have it.',
      'You agree to things you don\'t want because saying no feels too costly.',
      'You know the right move but keep "gathering more information" as a delay tactic.',
    ],
    coachingReps: [
      'Name one fear-driven avoidance this week. Not to conquer it — just to name it honestly. Naming lowers the charge and makes the next step possible.',
      'Take one small action you\'ve been postponing — a message, a call, a decision. Do it within 90 seconds of noticing the avoidance. Speed defeats the internal negotiation.',
      'Practice the Boundary Rep: this week, say "I can\'t do that this week" to one request — without offering an explanation or an alternative. The sentence is the rep.',
    ],
  },
  R5: {
    definition: 'Purpose is the capacity to name what matters and organize your life around it.',
    science:
      'Purpose stabilizes energy. When your actions match what matters, effort becomes sustainable and decisions simplify. Purpose doesn\'t need a grand vision — it needs a clear, honest answer to "What am I doing this for?"',
    whenStrong: [
      'You can explain why you do your work in one sentence — and it doesn\'t sound like a job description.',
      'When you say no, you know what you\'re saying yes to.',
      'Your calendar reflects what you care about, not just what other people need from you.',
    ],
    whenEclipsed: [
      'You\'re productive but can\'t say what it\'s all for.',
      'You feel busy every day but empty at the end of the week.',
      'You\'ve stopped asking "why" because the answer makes you uncomfortable.',
    ],
    coachingReps: [
      'Complete this sentence three different ways today: "I do what I do because ___." Notice which version your body believes.',
      'Review your calendar for next week. Circle one commitment that doesn\'t serve your purpose. You don\'t have to cancel it — but you need to see it.',
      'Ask one person you trust: "What do you think I care about most?" Their answer may surprise you — the gap between intention and perception is the growth edge.',
    ],
  },
  R6: {
    definition: 'Authenticity is the capacity to be the same person across contexts — consistent self regardless of audience.',
    science:
      'When your goals match your values, energy stays steady. When you perform a version of yourself that doesn\'t fit, it drains you fast. Authenticity isn\'t radical transparency — it\'s reducing the cost of performance.',
    whenStrong: [
      'The version of you in the boardroom is recognizable to the version of you at home.',
      'You share an honest opinion in a meeting even when it\'s not what people want to hear.',
      'You stop performing a role and start doing the work as yourself.',
    ],
    whenEclipsed: [
      'You maintain different personas for different audiences — and each one is exhausting.',
      'You agree publicly with something you disagree with privately.',
      'You can\'t remember the last time you said what you actually think in a professional setting.',
    ],
    coachingReps: [
      'The Consistency Check: pick two contexts this week (work, home, friends). Notice where your tone, posture, or language shifts most. That gap is your data.',
      'Say one true thing in a meeting this week that you would have normally softened, qualified, or skipped. Not reckless honesty — just removing one layer of performance.',
      'Journal for 3 minutes on: "Where am I performing a version of myself that doesn\'t match what I actually feel?" No solution needed — just the noticing.',
    ],
  },
  R7: {
    definition: 'Connection is the capacity to read the emotional cues around you and respond with accuracy.',
    science:
      'Connection is co-regulation. When you are grounded, people feel safer and share the real signal, not the polished one. Connection isn\'t a personality trait — it\'s a skill that requires available range.',
    whenStrong: [
      'You notice your colleague is off before they say anything — and you check in without making it a performance.',
      'You hold space for someone\'s frustration without trying to solve it.',
      'Your team trusts you with the real version of what\'s happening, not the polished one.',
    ],
    whenEclipsed: [
      'You miss emotional cues that used to be obvious — someone was upset and you didn\'t notice until later.',
      'You hear what people say but not what they mean.',
      'You\'re physically present in conversations but emotionally checked out. People can tell.',
    ],
    coachingReps: [
      'In your next conversation, practice the Attunement Rep: listen for the emotion underneath the words. After they finish, reflect it back: "It sounds like that was ___." You don\'t have to be right — the attempt itself is the connection.',
      'Ask one person this week: "How are you actually doing?" Then wait. Don\'t fill the silence. The wait is the rep.',
      'Notice one moment today where someone needed something from you emotionally and you didn\'t have it to give. No judgment — just track the pattern over a week.',
    ],
  },
  R8: {
    definition: 'Possibility is the capacity to hold a flexible, open stance toward new information — even when it challenges what you thought was true.',
    science:
      'Flexibility under pressure is a leadership advantage. Possibility is the willingness to update your map when new information arrives. This keeps you adaptive instead of stuck.',
    whenStrong: [
      'Someone disagrees with your plan and you get curious instead of defensive.',
      'You try a new approach even when the old one still technically works.',
      'You see a setback as data rather than evidence of failure.',
    ],
    whenEclipsed: [
      'You default to "we\'ve always done it this way" even when you know it\'s not working.',
      'New information feels threatening rather than useful.',
      'You\'ve stopped experimenting — everything is optimized for safety, nothing for growth.',
    ],
    coachingReps: [
      'The Curiosity Rep: the next time someone challenges your idea, pause and ask one genuine question before responding. Not a rhetorical question — a real one.',
      'Try one thing differently this week — a different route, a different morning routine, a different way of starting a meeting. The novelty itself exercises cognitive flexibility.',
      'Write down one belief you hold strongly about your work. Then write the strongest argument against it. You don\'t have to change your mind — the exercise builds flexibility.',
    ],
  },
  R9: {
    definition: 'Be The Light is the capacity to set the visible standard — to regulate yourself in ways that regulate the room.',
    science:
      'Your state spreads. People learn regulation by watching how you handle pressure in real time. Your steadiness becomes the standard others borrow.',
    whenStrong: [
      'The room gets tense and you hold steady — not performing calm, actually steady.',
      'Your team mirrors your energy: when you\'re grounded, they settle. When you\'re scattered, they scatter.',
      'You model the standard instead of just describing it. You do the rep before you ask anyone else to.',
    ],
    whenEclipsed: [
      'You motivate an entire room but can\'t motivate yourself to rest.',
      'Your standards for others are higher than your standards for yourself — and your body is paying the tax.',
      'You\'re the person everyone leans on, but no one checks on.',
    ],
    coachingReps: [
      'The Regulation Rep: in your next tense moment, take one visible breath before speaking. Not hidden, not subtle — let people see you choosing to pause. That visible pause is leadership.',
      'Ask yourself: "Am I holding a standard I\'m not living?" Pick one area where your behavior doesn\'t match what you ask of others. Close that gap by 10% this week.',
      'Practice receiving help. This week, let one person do something for you that you normally handle yourself. Modeling receptivity is as powerful as modeling strength.',
    ],
  },
};

export function getRayExplanation(rayId: string): RayExplanation | null {
  return RAY_EXPLANATIONS[rayId] ?? null;
}

// ── Power Source / Train Next ───────────────────────────────

export function getPowerSourceLabel(rayName: string): string {
  return `${rayName} is one of your strongest beams — this is where your gravitational stability comes from.`;
}

export function getTrainNextLabel(rayName: string): string {
  return `${rayName} is your next beam to strengthen. Not a verdict — a growth edge.`;
}

// ── Phase Labels ────────────────────────────────────────────

const PHASE_LABELS: Record<string, string> = {
  Reconnect: 'Reconnect — returning to center.',
  Radiate: 'Radiate — extending capacity outward.',
  Become: 'Become — the stability others lean on.',
};

const PHASE_EXPLANATIONS: Record<string, string> = {
  Reconnect:
    'Rays 1-3 train emotional intelligence with yourself — how you set direction, access internal fuel, and stay present when the world pulls you in every direction. This is the foundation everything else is built on.',
  Radiate:
    'Rays 4-6 train the bridge between inner capacity and outer action — how you move through fear, organize around what matters, and show up as yourself across contexts. This is where internal stability becomes visible performance.',
  Become:
    'Rays 7-9 train emotional intelligence with others — how you read the room, stay open to new information, and set the standard through your own behavior. This is where personal capacity becomes collective impact.',
};

export function getPhaseLabel(phase: string): string {
  return PHASE_LABELS[phase] ?? phase;
}

export function getPhaseExplanation(phase: string): string {
  return PHASE_EXPLANATIONS[phase] ?? '';
}

// ── Eclipse Modifier Labels ─────────────────────────────────

export function getModifierLabel(modifier: string): string {
  switch (modifier) {
    case 'AMPLIFIED':
      return 'This beam is carrying extra weight under pressure. One strong capacity is covering another that\'s temporarily eclipsed. Useful short-term, but not sustainable if the load stays high.';
    case 'MUTED':
      return 'This beam dims when load increases — a natural conservation response. Your system protects energy by narrowing access. This ray isn\'t damaged — it\'s waiting for the load to lift.';
    default:
      return '';
  }
}

// ── Gate Mode (cosmic) ──────────────────────────────────────

const GATE_COSMIC: Record<string, string> = {
  STABILIZE: 'Your orbit needs steadying before you expand. That is not retreat — that is foundation.',
  BUILD_RANGE: 'Room to grow. Stay intentional about what you take on.',
  STRETCH: 'Clear skies. Your system has capacity for progressive work.',
};

const GATE_EXPLANATIONS: Record<string, string> = {
  STABILIZE:
    'Your system flagged stabilization because expanding under high load reinforces compensating patterns. Reduce commitments, increase recovery reps, and let your baseline reset before adding challenge.',
  BUILD_RANGE:
    'You have enough headroom to take on new challenges without overloading your system. Choose where to invest your energy and build with steady reps.',
  STRETCH:
    'Your system has high stability and available capacity. Push into growth edges with deliberate challenge — just outside your comfort zone, not outside recovery.',
};

export function getGateCosmicLabel(mode: string): string {
  return GATE_COSMIC[mode] ?? mode;
}

export function getGateExplanation(mode: string): string {
  return GATE_EXPLANATIONS[mode] ?? '';
}

// ── Metric Detail Labels ────────────────────────────────────

export interface MetricExplanation {
  title: string;
  description: string;
  science: string;
}

const METRIC_EXPLANATIONS: Record<string, MetricExplanation> = {
  recovery_access: {
    title: 'Recovery Access',
    description: 'How much energy your system has available to recover and rebuild. Higher means more capacity for growth work.',
    science:
      'Recovery access is how quickly and fully your system returns to steady after a push. High means you reset between demands; low means activation lingers and recovery doesn\'t complete.',
  },
  load_pressure: {
    title: 'Load Pressure',
    description: 'The weight your system is currently carrying across emotional, cognitive, and relational dimensions.',
    science:
      'Load pressure blends emotional, cognitive, and relational demand. One channel can compensate for another until a small trigger tips the system. The composite shows total pressure, not just the loudest signal.',
  },
};

export function getMetricExplanation(key: string): MetricExplanation | null {
  return METRIC_EXPLANATIONS[key] ?? null;
}
