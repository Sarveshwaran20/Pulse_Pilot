'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Cockpit component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6 rounded-lg bg-[#14080B] border border-rose-500/40 text-rose-300 font-mono text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
            <span>⚠️ Telemetry Component Exception</span>
          </div>
          <p className="text-zinc-400">
            {this.state.error?.message || 'An unexpected rendering anomaly occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 cursor-pointer"
          >
            Recover & Re-render Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
