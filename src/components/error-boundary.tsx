/**
 * Client error boundary that captures exceptions and stores them in SQLite.
 */
"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useCallback } from "react";
import { Button } from "@/ui/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Displays a friendly error UI with retry support.
 */
const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="rounded-lg border border-panel-border bg-panel p-6 text-slate-100">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-300">
        The error was logged locally so you can review it in the Logs screen.
      </p>
      <pre className="mt-4 whitespace-pre-wrap rounded-md bg-slate-900 p-3 text-xs text-slate-200">
        {error.message}
      </pre>
      <Button className="mt-4" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Wraps the application with error capture and local persistence.
 */
export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  /**
   * Sends captured client errors to the server for persistence.
   */
  const handleError = useCallback((error: Error, info: { componentStack: string }) => {
    // Capture client errors so they appear in the Logs screen.
    fetch("/api/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "client",
        message: error.message,
        stack: `${error.stack ?? ""}\n${info.componentStack}`
      })
    }).catch(() => {
      // Swallow logging failures to avoid cascading crashes in the boundary.
    });
  }, []);

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};
