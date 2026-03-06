'use client';

interface ArchetypeCoachingCardProps {
  archetypeName: string;
  startingTools: string;
  bottomRayName: string | null;
  onOpenWatchMe: (target: string, move: string) => void;
  onOpenGoFirst: (action: string) => void;
}

interface ParsedTool {
  tool: string;
  cue: string;
  microRep: string;
}

function parseStartingTools(raw: string): ParsedTool[] {
  if (!raw) return [];
  return raw
    .split(/\n-\s+/)
    .filter(Boolean)
    .map((line) => {
      const toolMatch = line.match(/\*\*(.+?)\*\*/);
      const cueMatch = line.match(/Cue:\s*(.+?)(?:\s*\||\s*$)/);
      const repMatch = line.match(/Micro-Rep:\s*(.+)/);
      return {
        tool: toolMatch?.[1] ?? 'Tool',
        cue: cueMatch?.[1]?.trim() ?? '',
        microRep: repMatch?.[1]?.trim() ?? '',
      };
    })
    .filter((t) => t.tool !== 'Tool' || t.cue || t.microRep);
}

export default function ArchetypeCoachingCard({
  archetypeName,
  startingTools,
  bottomRayName,
  onOpenWatchMe,
  onOpenGoFirst,
}: ArchetypeCoachingCardProps) {
  const tools = parseStartingTools(startingTools);

  if (tools.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5">
      <div>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--gold-primary)' }}
        >
          Today&apos;s Coaching
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
          Tools for the {archetypeName}
          {bottomRayName ? ` · Training: ${bottomRayName}` : ''}
        </p>
      </div>

      <div className="space-y-3">
        {tools.slice(0, 3).map((t, i) => (
          <div
            key={i}
            className="rounded-xl p-4 space-y-2"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
            }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              {t.tool}
            </p>
            {t.cue && (
              <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                <span className="font-medium" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Cue:
                </span>{' '}
                {t.cue}
              </p>
            )}
            {t.microRep && (
              <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                <span className="font-medium" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Rep:
                </span>{' '}
                {t.microRep}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className="btn-ghost text-xs px-3 py-1.5"
                onClick={() => onOpenWatchMe(t.cue || t.tool, t.microRep)}
              >
                🎯 Watch Me
              </button>
              <button
                type="button"
                className="btn-ghost text-xs px-3 py-1.5"
                onClick={() => onOpenGoFirst(t.microRep || t.cue)}
              >
                🚀 Go First
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
