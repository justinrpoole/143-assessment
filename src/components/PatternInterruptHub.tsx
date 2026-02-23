'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const WatchMeModal = dynamic(() => import('./WatchMeModal'), { ssr: false });
const GoFirstModal = dynamic(() => import('./GoFirstModal'), { ssr: false });
const IRiseModal = dynamic(() => import('./IRiseModal'), { ssr: false });

type ActiveModal = 'watch_me' | 'go_first' | 'i_rise' | null;

interface Props {
  /** Called after any rep is successfully logged */
  onRepLogged?: () => void;
}

export default function PatternInterruptHub({ onRepLogged }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<ActiveModal>(null);

  function open(modal: ActiveModal) {
    setExpanded(false);
    setActive(modal);
  }

  function close() {
    setActive(null);
  }

  return (
    <>
      {/* Floating button cluster — bottom right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

        {/* Expanded tool options */}
        {expanded && (
          <div className="flex flex-col items-end gap-2 animate-fade-in-up">

            {/* I Rise — softest, shown first */}
            <div className="flex items-center gap-2">
              <span className="text-on-dark text-xs rounded-full px-3 py-1 whitespace-nowrap" style={{ background: 'rgba(2, 2, 2, 0.7)' }}>
                I need to return to myself
              </span>
              <button
                onClick={() => open('i_rise')}
                className="w-12 h-12 rounded-full text-on-dark shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, var(--cosmic-purple-deep), var(--cosmic-purple-gradient))' }}
                aria-label="I Rise"
              >
                ☀️
              </button>
            </div>

            {/* Go First */}
            <div className="flex items-center gap-2">
              <span className="text-on-dark text-xs rounded-full px-3 py-1 whitespace-nowrap" style={{ background: 'rgba(2, 2, 2, 0.7)' }}>
                I need to start
              </span>
              <button
                onClick={() => open('go_first')}
                className="w-12 h-12 rounded-full text-on-dark shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
                style={{ background: 'var(--cosmic-purple-deep)' }}
                aria-label="Go First"
              >
                🚀
              </button>
            </div>

            {/* Watch Me */}
            <div className="flex items-center gap-2">
              <span className="text-on-dark text-xs rounded-full px-3 py-1 whitespace-nowrap" style={{ background: 'rgba(2, 2, 2, 0.7)' }}>
                I need to refocus
              </span>
              <button
                onClick={() => open('watch_me')}
                className="w-12 h-12 rounded-full text-on-dark shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
                style={{ background: 'var(--cosmic-purple-vivid)' }}
                aria-label="Watch Me"
              >
                🎯
              </button>
            </div>
          </div>
        )}

        {/* Primary FAB */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-on-dark font-bold text-lg transition-all duration-200 ${
            expanded ? 'rotate-45' : ''
          }`}
          style={{ background: expanded ? 'var(--cosmic-purple-mid)' : 'var(--cosmic-purple-gradient)' }}
          aria-label={expanded ? 'Close tools' : 'Open pattern interrupt tools'}
        >
          {expanded ? '×' : '⚡'}
        </button>
      </div>

      {/* Backdrop for expanded state */}
      {expanded && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Modals */}
      {active === 'watch_me' && (
        <WatchMeModal
          onClose={close}
          onRepLogged={onRepLogged}
        />
      )}
      {active === 'go_first' && (
        <GoFirstModal
          onClose={close}
          onRepLogged={onRepLogged}
        />
      )}
      {active === 'i_rise' && (
        <IRiseModal
          onClose={close}
          onRepLogged={onRepLogged}
        />
      )}
    </>
  );
}
