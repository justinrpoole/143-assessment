"use client";
import { useRouter } from "next/navigation";

const TOOLS = [
  { id:"T001", name:"Watch Me", icon:"👁", color:"#7C3AED", tagline:"Turn fear into action.", what:"A nervous system override. When hesitation shows up, Watch Me turns it into a chosen move. Not motivation — ignition.", time:"2 min" },
  { id:"T002", name:"Go First", icon:"🚀", color:"#FF9D2E", tagline:"Break the freeze.", what:"The external momentum move. Be the first one to act — before you feel ready. Confidence builds on the other side.", time:"2 min" },
  { id:"T003", name:"I Rise", icon:"🌅", color:"#EC4899", tagline:"Return to yourself.", what:"The quiet identity reset. When you've drifted, I Rise brings you back. Not hype — authorship.", time:"60 sec" },
  { id:"T004", name:"Presence Pause", icon:"🌬", color:"#06B6D4", tagline:"Choose your next move.", what:"The smallest interruption. Takes 10 seconds. Returns you to command before urgency drives the car.", time:"10 sec" },
];

export default function ToolsFirstPage() {
  const router = useRouter();

  function handleContinue() {
    if (typeof window !== "undefined") localStorage.setItem("onboarding_complete", "true");
    // Route through onboarding/complete — it checks for runs and routes correctly
    router.push("/onboarding/complete");
  }

  return (
    <main className="cosmic-page-bg min-h-screen flex items-center justify-center px-5 py-12">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
          <p className="gold-tag inline-block mb-4">Your Tools</p>
          <h1 className="text-2xl font-bold text-white mb-2">Before you read your map — meet your tools.</h1>
          <p className="text-sm" style={{color:"var(--text-on-dark-secondary)"}}>
            These 4 protocols live in your portal. They train your 9 Rays. Start here — before the Ray content.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map(t => (
            <div key={t.id} className="glass-card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.icon}</span>
                <span className="font-bold text-white text-sm">{t.name}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{background:"rgba(255,211,90,0.15)",color:"#FFD35A"}}>{t.time}</span>
              </div>
              <p className="text-xs font-semibold" style={{color:t.color}}>{t.tagline}</p>
              <p className="text-xs leading-relaxed" style={{color:"var(--text-on-dark-secondary)"}}>{t.what}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-xs mb-4" style={{color:"var(--text-on-dark-secondary)"}}>
            Down to earth. Backed by science. Each tool has a specific mechanism — you&apos;ll see it in your results.
          </p>
          <button onClick={handleContinue}
            className="px-10 py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all"
            style={{background:"linear-gradient(180deg,#FFD35A 0%,#E07800 100%)",color:"#060014",boxShadow:"0 4px 20px rgba(255,211,90,0.4)"}}>
            I&apos;m Ready — Show My Map →
          </button>
        </div>
      </div>
    </main>
  );
}
