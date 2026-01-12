/**
 * App-wide providers for error tracking and layout wrappers.
 */
"use client";

import { ErrorBoundary } from "@/components/error-boundary";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with the global error boundary.
 */
export const Providers = ({ children }: ProvidersProps) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
