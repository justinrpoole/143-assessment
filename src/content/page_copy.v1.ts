export interface V1PageCopy {
  upgradeYourOs: {
    label: string;
    headline: string;
    subhead: string;
    ctas: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
    };
    questionBand: string[];
    problemSection: {
      title: string;
      body: string;
    };
    nextStepSection: {
      title: string;
      body: string;
    };
    whyThisWorks: {
      title: string;
      body: string;
      proof: string;
      outcome: string;
      loop: string;
    };
    tiles: Array<{
      title: string;
      body: string;
      links: Array<{ label: string; href: string }>;
    }>;
  };
  howItWorks: {
    label: string;
    headline: string;
    subhead: string;
    ctas: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
      tertiary: { label: string; href: string };
    };
    funnelSteps: Array<{ step: string; detail: string }>;
    whatYouGet: {
      title: string;
      cards: Array<{ title: string; body: string }>;
    };
    repeatWhy: {
      title: string;
      body: string;
    };
    outcome: string;
    cancellationNote: string;
  };
  outcomes: {
    label: string;
    headline: string;
    subhead: string;
    winsTitle: string;
    wins: string[];
    howTitle: string;
    howBody: string;
    proof: string;
    loop: string;
  };
  challenge143: {
    label: string;
    headline: string;
    subhead: string;
    ctas: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
    };
    introQuestion: string;
    startNowTitle: string;
    startNowBody: string;
    challengeSteps: string[];
    kitTitle: string;
    kitBody: string;
    kitIncludes: string[];
    close: string;
  };
  preview: {
    headline: string;
    why: string;
    proof: string;
    how: string;
    outcome: string;
    loop: string;
    paidTierTitle: string;
    paidTierBody: string;
  };
  sampleReport: {
    label: string;
    headline: string;
    subhead: string;
    samplePairId: string;
    proofTitle: string;
    proofBody: string;
    howBody: string;
    paidTierTitle: string;
    paidTierItems: string[];
    outcome: string;
    loop: string;
    ctas: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
    };
  };
  justin: {
    label: string;
    headline: string;
    subhead: string;
    credibilityTitle: string;
    credibilityBody: string;
    storyBody: string;
    trustTitle: string;
    dontDo: string[];
    do: string[];
    methodTitle: string;
    methodBody: string;
    outcome: string;
    loop: string;
  };
}

export const PAGE_COPY_V1: V1PageCopy = {
  upgradeYourOs: {
    label: "Leadership is not personality. It is capacity.",
    headline:
      "Your operating system runs every decision you make. When was the last time you upgraded it?",
    subhead:
      "143 Leadership measures 9 trainable capacities, detects when exhaustion is masking the real you, and gives you the tools to rebuild \u2014 with proof that it is working. Not a personality label. A behavioral map that changes as you do.",
    ctas: {
      primary: {
        label: "Take the Assessment \u2014 $43",
        href: "#tiles",
      },
      secondary: {
        label: "See the 9 Rays first",
        href: "/faq",
      },
    },
    questionBand: [
      "You open your laptop and check email before your feet hit the floor. You had a plan this morning. It is gone by 8:15.",
      "Someone asks how you are doing and you say 'fine' because the real answer would take too long. You are running meetings on borrowed energy and calling it leadership.",
      "Your body has been braced since 7 AM and you have not noticed. Your shoulders are around your ears. You are running on survival fuel and calling it discipline.",
    ],
    problemSection: {
      title: "Your light is not gone. It is covered.",
      body: "When sustained stress stays elevated too long, it changes how you think, feel, and decide. That is not a personal failure. That is biology. The 143 Assessment detects eclipse \u2014 the gap between your real capacity and what exhaustion is letting you access right now.",
    },
    nextStepSection: {
      title: "Which leader are you when the light is on?",
      body: "Your top two Rays combine into one of 36 Light Signatures. You might be a Strategic Optimist, a Decisive Director, or a Calm Center. The assessment reveals yours.",
    },
    whyThisWorks: {
      title:
        "9 dimensions. Each one trainable. Together, they map your emotional intelligence.",
      body: "The first three Rays train emotional intelligence with yourself. The last three train emotional intelligence with others. The middle three are where they meet: power, purpose, authenticity. These are not personality types. They are capacities. Every one of them can be built through reps, not revelation.",
      proof:
        "$43 for the full assessment with your Light Signature and Eclipse Snapshot. $14.33/mo for unlimited retakes and growth tracking. Your scores are the receipt.",
      outcome:
        "Outcome: a map of where your light is strong, where it is covered, and what to do about it this week.",
      loop: "Take it. Train. Retake in 90 days and watch your scores move \u2014 proof the reps are landing.",
    },
    tiles: [
      {
        title: "The Light Check \u2014 Free",
        body: "A free preview that names what you are feeling and why. No account. No commitment. Three minutes to find out whether eclipse is running your week.",
        links: [{ label: "Take the Light Check", href: "/143" }],
      },
      {
        title: "The Ray Snapshot",
        body: "See your top 2 Rays and your Eclipse Snapshot. Enough to understand what is working and what is covered \u2014 and whether you might be a Bold Authentic, a Relational Light, or one of 34 other combinations.",
        links: [{ label: "Get Your Snapshot", href: "/preview" }],
      },
      {
        title: "Gravitational Stability Report \u2014 $43",
        body: "A map of exactly where your light is strong, where it is covered, and what to do about it this week. Your Light Signature. Your Eclipse Snapshot. Your Energy Ratio. Your Rise Path.",
        links: [{ label: "Take the Assessment", href: "/upgrade" }],
      },
      {
        title: "Portal Membership \u2014 $14.33/mo",
        body: "The assessment plus daily tools, micro-practices, and unlimited retakes. Take it. Train. Retake it in 90 days and watch your scores move \u2014 proof the reps are landing.",
        links: [
          { label: "Start the Portal Membership", href: "/morning" },
          { label: "Micro Joy Reps", href: "/micro-joy" },
        ],
      },
    ],
  },
  howItWorks: {
    label: "Four stages. One operating system.",
    headline:
      "Reset your filter. Map your capacities. Train the gaps. Measure the proof.",
    subhead: "Every stage builds on the last. Nothing is skipped.",
    ctas: {
      primary: {
        label: "Start with the free challenge",
        href: "/preview",
      },
      secondary: {
        label: "See pricing",
        href: "/pricing",
      },
      tertiary: {
        label: "Choose your entry point",
        href: "/upgrade-your-os",
      },
    },
    funnelSteps: [
      {
        step: "1) Reset Your Filter",
        detail:
          "The 143 Challenge rewires your Reticular Activating System to scan for evidence of capacity instead of threat. Three days. Free.",
      },
      {
        step: "2) Map Your Capacities",
        detail:
          "The 143 Assessment maps your 9 Rays, reveals your Light Signature, and shows where Eclipse may be covering real capacity.",
      },
      {
        step: "3) Train the Gaps",
        detail:
          "13 science-backed protocols mapped to your specific Rays. The 90-Second Reset, the RAS Recalibration Practice, the Boundary of Light Protocol, and more.",
      },
      {
        step: "4) Measure the Proof",
        detail:
          "Retake the assessment. Watch your scores move. Your Light Signature evolves as you do. That is not inconsistency. That is growth.",
      },
    ],
    whatYouGet: {
      title: "What you get at every level",
      cards: [
        {
          title: "Free \u2014 The 143 Challenge",
          body: "Your brain is running a threat filter you never installed. The 143 Challenge reprograms it in 3 days \u2014 3 minutes a day. 143 means I love you. Self-directed compassion that gives your RAS new search instructions. No email required to start.",
        },
        {
          title: "$43 \u2014 Gravitational Stability Report",
          body: "Your complete 9-Ray capacity map, Eclipse Snapshot, your Light Signature with identity opener, and specific tool recommendations. Lifetime access.",
        },
      ],
    },
    repeatWhy: {
      title: "Why take it more than once",
      body: "Most assessments are designed to be taken once. The 143 is designed to be outgrown. Your scores change because you changed. The retake is not a re-test. It is a receipt. And when your Light Signature shifts, that is not inconsistency. That is growth becoming visible.",
    },
    outcome:
      "Outcome: a system that proves your growth over time \u2014 not a one-time result that collects dust.",
    cancellationNote:
      "Cancel anytime. Your assessment history stays. Your data does not disappear. When you come back, your map is waiting.",
  },
  outcomes: {
    label: "This is what changes.",
    headline: "The room changes when you do.",
    subhead: "Not promises. Patterns we see in people who do the work.",
    winsTitle: "Everyday wins you can expect",
    wins: [
      "You stop rehearsing conversations before they happen. Your nervous system learns you can handle the moment when it arrives.",
      "You recover from hard moments in minutes instead of days. The 90-Second Reset teaches you to feel the spike and let it pass.",
      "You notice what is working before someone has to point it out. Your RAS recalibrates and the negativity bias loosens its grip.",
      "You stop absorbing other people's energy as your own. Your Connection Ray trains you to feel what someone is carrying without picking it up.",
      "You say the hard thing without the adrenaline spike. Courageous conversations stop feeling like combat.",
      "You make decisions faster because your signal is clearer. The fog lifts when your operating system runs clean.",
      "Your confidence stops depending on the last thing that happened. It becomes baseline \u2014 built through reps, not reactive.",
    ],
    howTitle: "How these outcomes happen",
    howBody:
      "None of this is magic. All of it is mechanism. The RAS filter resets. The stress response shortens. Identity updates through evidence. Eclipse lifts when you stop borrowing energy and start building capacity.",
    proof:
      "Take the assessment and see where you stand. Your results are the starting line, not the finish.",
    loop: "Retake in 90 days and watch your scores move. Growth becomes visible. Not a feeling. A number.",
  },
  challenge143: {
    label: "The 143 Challenge",
    headline:
      "Using your brain\u2019s pattern recognition system to build self-love.",
    subhead:
      "Self-directed compassion plus attention steering to keep standards sustainable. Not fluff. Not ego. A reprogramming act. 143 is your permission slip and your proof.",
    ctas: {
      primary: {
        label: "Start the Challenge",
        href: "/toolkit",
      },
      secondary: {
        label: "See the protocol",
        href: "#challenge-start-now",
      },
    },
    introQuestion:
      "Think of the last time you felt like you made a mistake. Did you use phrases like \u201cI\u2019m so stupid\u201d or other negative self-talk? That is not a character flaw. That is your Reticular Activating System running a threat filter you never installed on purpose.",
    startNowTitle: "The 143 Protocol",
    startNowBody:
      "When you see 143 \u2014 or choose a cue \u2014 hand over heart. Say: \u201cI love you.\u201d Add: \u201cI\u2019m safe. I\u2019m happy. I\u2019m loved.\u201d Choose one aligned action immediately. That is a rep.",
    challengeSteps: [
      "Day 1 \u2014 Recognition: Notice three things that went right. Write them down. You are feeding your RAS new search instructions.",
      "Day 2 \u2014 Encouragement: Connect each moment to a capacity. \u2018I stayed steady\u2019 becomes \u2018I can regulate.\u2019",
      "Day 3 \u2014 Direction: Pick one word. Carry it all day. When you see it reflected, say: \u2018There it is.\u2019",
    ],
    kitTitle: "Challenge Kit",
    kitBody:
      "The three-day challenge works on its own. The kit makes it stick.",
    kitIncludes: [
      "Tracker PDF \u2014 A printable daily log for all three days",
      "Daily Prompts \u2014 One email each morning, short and specific",
      "90-Second Reset Audio \u2014 Brings you back online when your nervous system spikes",
      "Share Cards \u2014 Functional reminders you can share or keep visible",
    ],
    close:
      "Self-compassion is not soft. It is stability. You do not need a new mindset. You need a new filter. The 143 Challenge teaches your mind to spot the light that was already there. \u201cI choose what my mind magnifies.\u201d",
  },
  preview: {
    headline:
      "See what your leadership operating system actually looks like. Free.",
    why: "Most assessments lock your results inside a paywall. The 143 preview gives you a real snapshot of your 9 Rays \u2014 your trainable leadership capacities \u2014 before you spend anything.",
    proof:
      "In 15 minutes, you will know your top two Rays and your Light Signature. The snapshot answers one question honestly: is this worth going deeper?",
    how: "Start the preview. See your ray signal across nine dimensions. Know whether Eclipse is running your week. If the answer is yes, the full report and Portal Membership are waiting.",
    outcome:
      "Outcome: the relief of being accurately described without being reduced. Not categorized. Not labeled. Recognized.",
    loop: "Your scores are designed to change. Retake after your first full run to see the proof.",
    paidTierTitle: "When you are ready to go deeper",
    paidTierBody:
      "The $43 Gravitational Stability Report gives you your Light Signature, Eclipse Snapshot, your Energy Ratio, and your Rise Path. The $14.33/month Portal Membership adds unlimited retakes, the full protocol library, and monthly snapshots that track your growth.",
  },
  sampleReport: {
    label: "Sample Report",
    headline: "This is what a full report looks like.",
    subhead: "Not a screenshot. Not a summary. The real experience.",
    samplePairId: "R4-R5",
    proofTitle: "What the Report Feels Like",
    proofBody:
      "The first thing you will notice is that it sounds like someone who knows you. Not someone who categorized you. Someone who has watched you navigate a hard week and can name what is actually happening underneath the performance.",
    howBody:
      "The report opens with your Light Signature and an identity opener: 'I know you are the type of person who...' Then the Eclipse Snapshot shows where stress may be suppressing real capacity. Then specific tool recommendations mapped to your profile.",
    paidTierTitle: "Two ways to use your report",
    paidTierItems: [
      "Gravitational Stability Report ($43) \u2014 Your full 9-Ray report, Eclipse Snapshot, your Light Signature with identity opener, and lifetime access.",
      "Portal Membership ($14.33/month) \u2014 Everything in the assessment, plus unlimited retakes, the full protocol library, and monthly snapshots that prove your growth.",
    ],
    outcome:
      "Outcome: a report that reads like someone who understands you handed you a map and said: start here.",
    loop: "Retake after training and watch your Light Signature evolve. That is not inconsistency. That is growth becoming visible.",
    ctas: {
      primary: {
        label: "Start Preview",
        href: "/preview",
      },
      secondary: {
        label: "Take the Assessment \u2014 $43",
        href: "/upgrade",
      },
    },
  },
  justin: {
    label: "The person inside the OS.",
    headline:
      "I do not motivate. I help you access what is already there.",
    subhead:
      "Executive development background. Real-world pressure. A framework built on behavioral science and tested in the rooms where leadership actually happens.",
    credibilityTitle: "The short version.",
    credibilityBody:
      "I spent years inside executive development. Real organizations. Real pressure. Leaders who needed real tools, not motivational slogans. That realization became the premise: upgrade the OS first. Then every tactic works.",
    storyBody:
      "I built the 143 Assessment because I needed it first. The leadership tools everyone was selling did not work \u2014 not because they were wrong, but because they assumed an operating system that was not running. Nine trainable capacities. Eclipse Snapshot. Non-shame language. A retake system that proves growth. I did not study this from a distance. I trained myself with these tools.",
    trustTitle: "No hype. Structure and receipts.",
    dontDo: [
      "Give motivational speeches that fade by Friday.",
      "Promise transformation without mechanism.",
      "Use shame language because it creates urgency.",
    ],
    do: [
      "Translate neuroscience into tools you can use today.",
      "Build systems that produce measurable change you can see at retake.",
      "Name the real thing plainly, even when it is hard.",
    ],
    methodTitle: "The method",
    methodBody:
      "Reset your filter. Map your capacities. Train the gaps. Measure the proof. The first three Rays train emotional intelligence with yourself. The middle three are where self-regulation meets self-expression. The last three train emotional intelligence with others. Nine dimensions. One operating system upgrade.",
    outcome:
      "Outcome: you move from scattered effort to aligned execution \u2014 with proof that the shift is real.",
    loop: "Take it. Train. Retake. Watch your Light Signature evolve. That is the work. That is the path.",
  },
};
