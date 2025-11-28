"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { createLogger } from "../lib/logger";
import { PageHeader } from "./page-header";
import { GlassCard } from "./glass-card";
import Link from "next/link";

const logger = createLogger("ErrorBoundary");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches React errors and logs them to Firebase Crashlytics
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error using our logger
    logger.error("Error caught by boundary", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="space-y-6">
          <PageHeader
            title="Something went wrong"
            subtitle="We're sorry, but something unexpected happened."
          />

          <GlassCard>
            <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
              <div className="space-y-4">
                <p className="text-sm text-[hsl(var(--muted))]">
                  An error occurred while loading this page. The error has been logged and we&apos;ll look into it.
                </p>

                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-3">
                    <p className="text-xs font-mono text-red-200 break-all">
                      {this.state.error.toString()}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-[10px] text-red-300/80 mt-2 whitespace-pre-wrap break-all">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Reload page
                  </button>
                  <Link href="/" className="btn-ghost text-xs">
                    Go to home
                  </Link>
                  <Link href="/contact" className="btn-ghost text-xs">
                    Contact support
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

