'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import RetroFrame from '@/components/ui/RetroFrame';

interface Props {
  children: ReactNode;
  /** Label for the RetroFrame (e.g., "ASSESSMENT", "REPORT") */
  sectionLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class CosmicErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      '[CosmicErrorBoundary]',
      error.message,
      info.componentStack,
    );
  }

  handleRecover = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <RetroFrame
          label={this.props.sectionLabel ?? 'SYSTEM'}
          accent="var(--surface-border)"
        >
          <div className="text-center py-8 space-y-4">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--surface-border)' }}
            >
              System Interference Detected
            </p>
            <p
              className="text-sm leading-relaxed max-w-md mx-auto"
              style={{ color: 'var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 70%, transparent))' }}
            >
              Something unexpected happened. Your progress is safe — nothing was lost.
              Hit recover to try again.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre
                className="text-xs text-left mx-auto max-w-lg overflow-auto p-3 rounded"
                style={{
                  color: 'var(--surface-border)',
                  background: 'var(--surface-border)',
                  maxHeight: '8rem',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleRecover}
              className="btn-primary inline-block px-6 py-2 text-sm"
            >
              Recover
            </button>
          </div>
        </RetroFrame>
      );
    }

    return this.props.children;
  }
}
