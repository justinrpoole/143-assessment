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
        title: "Gravitational Stability Check \u2014 Free",
        body: "A free preview that names what you are feeling and why. No account. No commitment. Three minutes to find out whether eclipse is running your week.",
        links: [{ label: "Check My Stability", href: "/preview" }],
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
    label: "Four stages. One operating system upgrade.",
    headline:
      "Reset the filter. Map the pattern. Train the gaps. Measure the proof.",
    subhead: "Every stage builds on the last. Nothing is skipped. Nothing is guessed. You will have receipts.",
    ctas: {
      primary: {
        label: "Start the 143 Challenge \u2014 Free",
        href: "/143",
      },
      secondary: {
        label: "See pricing",
        href: "/pricing",
      },
      tertiary: {
        label: "See all entry points",
        href: "/upgrade-your-os",
      },
    },
    funnelSteps: [
      {
        step: "1) Reset Your Filter",
        detail:
          "The 143 Challenge rewires your Reticular Activating System \u2014 the part of your brain that decides what you notice \u2014 to scan for capacity instead of threat. Three days. Three minutes a day. Free. No account required.",
      },
      {
        step: "2) Map Your Capacities",
        detail:
          "The 143 Assessment measures 9 trainable Rays, reveals your Light Signature (one of 36 unique combinations), and shows where Eclipse may be covering real capacity. 143 questions. About 15 minutes. The most honest mirror your leadership has seen.",
      },
      {
        step: "3) Train the Gaps",
        detail:
          "13 science-backed protocols mapped to your specific Rays. The 90-Second Reset when your nervous system spikes. The RAS Recalibration Practice. The Boundary of Light Protocol. Each one takes minutes, not hours.",
      },
      {
        step: "4) Measure the Proof",
        detail:
          "Retake the assessment in 90 days. Watch your scores move. When your Light Signature shifts from Driven Leader to Visionary Servant, that is not inconsistency. That is growth becoming visible. Your scores are the receipt.",
      },
    ],
    whatYouGet: {
      title: "What you get at every level",
      cards: [
        {
          title: "Free \u2014 The 143 Challenge",
          body: "Your brain is running a threat filter you never chose. The 143 Challenge reprograms it in 3 days \u2014 3 minutes a day. 143 means I love you. Self-directed compassion that gives your RAS new search instructions. No email required to start.",
        },
        {
          title: "$43 \u2014 Gravitational Stability Report",
          body: "Your complete 9-Ray capacity map, Eclipse Snapshot, Light Signature with personal identity opener, Energy Ratio, Rise Path, and specific tool recommendations. Lifetime access. Downloadable PDF.",
        },
        {
          title: "$14.33/mo \u2014 Portal Membership",
          body: "Everything in the report plus daily micro-practices, unlimited monthly retakes, a growth dashboard, and Watch Me and Go First interactive flows. See your scores change month over month. Cancel anytime.",
        },
        {
          title: "$143/week \u2014 10-Week Coaching",
          body: "Structured coaching built on your report. Weekly sessions matched to your results. Mid-point and final retake with comparison. Direct support between sessions. Portal Membership included.",
        },
      ],
    },
    repeatWhy: {
      title: "Why take it more than once",
      body: "Most assessments are designed to be taken once and filed away. The 143 is designed to be outgrown. Your scores change because you changed. The retake is not a re-test. It is a receipt. When your Light Signature shifts, that is not inconsistency. That is growth you can measure. That is the difference between this and every assessment you have taken before.",
    },
    outcome:
      "Outcome: a system that proves your growth over time \u2014 not a one-time insight that collects dust in a PDF nobody opens.",
    cancellationNote:
      "Cancel anytime. No penalties. No exit interviews. Your assessment history stays. Your data does not disappear. When you come back, your map is waiting.",
  },
  outcomes: {
    label: "This is what changes when the operating system upgrades.",
    headline: "The room changes when you do. So does Tuesday.",
    subhead: "Not promises. Patterns we see in people who do the reps. Every outcome maps to a specific Ray and a specific mechanism.",
    winsTitle: "What the reps actually produce",
    wins: [
      "You stop rehearsing conversations before they happen. Your nervous system learns you can handle the moment when it arrives. That is your Presence Ray coming back online.",
      "You recover from hard moments in minutes instead of days. The 90-Second Reset teaches your body to feel the spike, name it, and let it pass. People around you notice the difference before you do.",
      "You notice what is working before someone has to point it out. Your RAS recalibrates. The negativity bias loosens its grip. You start scanning for evidence of capacity instead of threat.",
      "You stop absorbing other people\u2019s energy as your own. Your Connection Ray trains you to feel what someone is carrying without picking it up. You stay grounded. They feel safer.",
      "You say the hard thing without the adrenaline spike. Courageous conversations stop feeling like combat. Your Power Ray and your Authenticity Ray start working together instead of against each other.",
      "You make decisions faster because your signal is clearer. The fog lifts when your operating system runs clean. One leader told us she went from 3 days of deliberation to 3 hours.",
      "Your confidence stops depending on the last thing that happened. It becomes baseline \u2014 built through reps, not reactive. That is the difference between borrowed energy and generated capacity.",
    ],
    howTitle: "How these outcomes happen",
    howBody:
      "None of this is magic. All of it is mechanism. The RAS filter resets. The stress response shortens. Identity updates through evidence, not affirmation. Eclipse lifts when you stop borrowing energy and start building capacity. Every tool in the system maps to published, peer-reviewed research. The language is human. The science is real.",
    proof:
      "Take the assessment and see where you stand. Your results are the starting line, not the finish. Your Light Signature tells you where to begin. Your Rise Path tells you what to do first.",
    loop: "Retake in 90 days and watch your scores move. Growth becomes visible. Not a feeling. A number. That is a receipt you can trust.",
  },
  challenge143: {
    label: "The 143 Challenge",
    headline:
      "You talk to yourself worse than you would talk to anyone you love. This rewires that in 3 days.",
    subhead:
      "Your brain filters 11 million bits of data per second. Right now it is scanning for what is wrong with you. The 143 Challenge gives it new instructions \u2014 in 3 minutes a day, for 3 days, using a protocol built on the same neuroscience powering the 143 Leadership Assessment. 143 means I love you. That is not a slogan. That is the mechanism. Free. No card required.",
    ctas: {
      primary: {
        label: "Send Me the Challenge Kit \u2014 Free",
        href: "/toolkit",
      },
      secondary: {
        label: "Show me how it works",
        href: "#challenge-start-now",
      },
    },
    introQuestion:
      "Last time you made a mistake at work, what did you say to yourself? If the answer was anything close to \u201cI\u2019m an idiot\u201d \u2014 that is not a character flaw. That is your Reticular Activating System running a threat filter you never chose. You installed it through years of stress. The 143 Challenge uninstalls it in 72 hours.",
    startNowTitle: "The 143 Protocol \u2014 3 Days. 3 Minutes. 1 Cue.",
    startNowBody:
      "Every time you see the number 143 \u2014 on a clock, a receipt, a licence plate \u2014 hand over heart. Say three words: I love you. Then add: I am safe. I am here. I am enough. Then choose one small action that matches who you want to be today. That is a rep. One rep rewires nothing. Three days of reps rewires your filter.",
    challengeSteps: [
      "Day 1 \u2014 Recognition: Notice three things that went right today. Write them down. You just gave your brain new search instructions. Your RAS will start looking for more.",
      "Day 2 \u2014 Encouragement: Connect each win to a capacity you already have. \u2018I stayed calm in that meeting\u2019 becomes \u2018I can regulate under pressure.\u2019 This is identity evidence. Your brain needs proof, not pep talks.",
      "Day 3 \u2014 Direction: Pick one word for your day. Carry it. When you spot it reflected in a moment \u2014 a conversation, a decision, a feeling \u2014 say: \u2018There it is.\u2019 You just trained your brain to find what you chose instead of what you fear.",
    ],
    kitTitle: "The 143 Challenge Kit \u2014 Everything You Need",
    kitBody:
      "The protocol works on its own. The kit removes every barrier to actually doing it.",
    kitIncludes: [
      "Printable Tracker \u2014 A daily log that takes 90 seconds to complete. Three days. One page.",
      "Morning Prompts \u2014 One email each morning with that day\u2019s exact protocol. Short. Specific. No fluff.",
      "90-Second Reset Audio \u2014 A guided nervous system reset you can use when the inner critic gets loud. Play it in your car, at your desk, before a hard conversation.",
      "Share Cards \u2014 Visual cue cards designed to trigger your 143 rep. Put one on your mirror. Send one to someone who needs it.",
    ],
    close:
      "Self-compassion is not soft. It is the reason your nervous system can sustain high standards without burning through you. Mel Robbins taught you to count down and move. This teaches your brain what to look for when it lands. The 143 Challenge is the entry point. The 143 Assessment is the map. Start with the free one. See what moves.",
  },
  preview: {
    headline:
      "Find out in 3 minutes whether exhaustion is covering your strongest capacity.",
    why: "Most leadership assessments lock your results past a paywall and a 30-minute intake form. The Gravitational Stability Check gives you a real signal \u2014 your Eclipse Snapshot and your top Rays \u2014 before you spend anything or create an account.",
    proof:
      "Answer a few targeted questions. See your ray signal across nine dimensions. Know whether your best capacity is online or eclipsed. The whole thing takes less time than your morning coffee order.",
    how: "No email. No account. No credit card. Just honest questions about how you showed up this week \u2014 and a snapshot that tells you what is actually happening underneath the performance.",
    outcome:
      "People say the same thing after seeing their snapshot: \u201cThat is exactly what I have been feeling but could not name.\u201d The relief of being accurately described without being reduced. Not categorized. Recognized.",
    loop: "If the snapshot resonates, the full assessment goes deeper \u2014 your complete Light Signature, Eclipse Snapshot, Energy Ratio, and a Rise Path with specific tools. Your scores are designed to change. That is the whole point.",
    paidTierTitle: "When you are ready to go deeper",
    paidTierBody:
      "The $43 Gravitational Stability Report gives you your Light Signature, Eclipse Snapshot, Energy Ratio, and Rise Path \u2014 a complete map of where your light is strong and where it is covered, with specific tool recommendations. The $14.33/month Portal Membership adds unlimited retakes, daily micro-practices, and a growth dashboard that proves the reps are landing.",
  },
  sampleReport: {
    label: "Sample Report",
    headline: "This is what a full report reads like. Not a screenshot. The real thing.",
    subhead: "Browse a sample Gravitational Stability Report \u2014 same format, same depth, same identity-first language. The only difference is the data is not yours. Yet.",
    samplePairId: "R4-R5",
    proofTitle: "What people say when they open their report",
    proofBody:
      "The first thing you will notice is that it sounds like someone who knows you. Not someone who categorized you. Someone who has watched you navigate a hard week and can name what is actually happening underneath the performance. That is by design. Every line of your report is generated from your specific answers, not a template.",
    howBody:
      "The report opens with your Light Signature and an identity opener: \u2018I know you are the type of person who...\u2019 Then the Eclipse Snapshot shows where stress may be suppressing real capacity. Then your Energy-to-Eclipse Ratio. Then your Rise Path with specific tool recommendations. Every section is mapped to your profile. Nothing is generic.",
    paidTierTitle: "Two ways to use your report",
    paidTierItems: [
      "Gravitational Stability Report ($43) \u2014 Your full 9-Ray report, Eclipse Snapshot, Light Signature with identity opener, Energy Ratio, Rise Path, and lifetime access. Downloadable PDF.",
      "Portal Membership ($14.33/month) \u2014 Everything in the report, plus unlimited monthly retakes, daily micro-practices, growth dashboard, and the tools to actually close the gap your report identifies. Cancel anytime.",
    ],
    outcome:
      "Outcome: a report that reads like someone who understands you handed you a map and said: start here. Not who you are. What you can build.",
    loop: "Retake after 90 days of training. Watch your Light Signature evolve. When it shifts, that is not inconsistency. That is growth you can see.",
    ctas: {
      primary: {
        label: "Check My Stability \u2014 Free",
        href: "/preview",
      },
      secondary: {
        label: "Get Your Full Report \u2014 $43",
        href: "/upgrade",
      },
    },
  },
  justin: {
    label: "The person who built the system \u2014 because he needed it first.",
    headline:
      "I do not motivate. I build maps for people who are tired of wandering.",
    subhead:
      "Executive development background. Real organisations. Real pressure. A framework built on behavioural science and tested in the rooms where leadership actually happens \u2014 not conference stages.",
    credibilityTitle: "The short version.",
    credibilityBody:
      "I spent years inside executive development watching the same pattern: a leader finishes a programme, feels genuinely changed, and watches the results fade by the following week. Not because the programme was bad. Because it never addressed what was underneath. That gap is why I built the 143 Assessment.",
    storyBody:
      "I built it because I needed it first. The leadership tools everyone was selling did not work \u2014 not because they were wrong, but because they assumed an operating system that was not running. I was stretched. Performing well and coming home empty. Running on borrowed energy and calling it discipline. So I started from scratch. Nine trainable capacities backed by peer-reviewed science. An Eclipse Snapshot that names the gap without shame. Non-diagnostic language because people develop faster when they feel safe. A retake system that proves growth is real. I did not study this from a distance. I trained myself with these tools and watched my own Light Signature change.",
    trustTitle: "No hype. Structure and receipts.",
    dontDo: [
      "Give motivational speeches that fade by Friday.",
      "Promise transformation without showing the mechanism.",
      "Use shame language to create urgency. Your gaps are not failures. They are covered capacities.",
    ],
    do: [
      "Translate neuroscience into tools you can use Monday morning.",
      "Build systems that produce measurable change \u2014 and show you the receipt at retake.",
      "Name the real thing plainly. Even when it is hard. Especially when it is hard.",
    ],
    methodTitle: "The method is the message",
    methodBody:
      "Reset the filter. Map the capacities. Train the gaps. Measure the proof. The first three Rays train emotional intelligence with yourself. The middle three are where self-regulation meets self-expression. The last three train emotional intelligence with others. Nine dimensions. One operating system upgrade. Not who you are. What you can build.",
    outcome:
      "Outcome: you move from scattered effort to aligned execution \u2014 with proof that the shift is real. Not a feeling. A number.",
    loop: "Take it. Train. Retake. Watch your Light Signature evolve. That is the work. That is the path. That is the difference between this and everything else you have tried.",
  },
};
