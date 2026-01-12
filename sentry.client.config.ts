/**
 * Client-side Sentry configuration (optional when SENTRY_DSN is set).
 */
import * as Sentry from "@sentry/nextjs";

/**
 * Initializes Sentry only when DSN is provided.
 */
export const initClientSentry = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1
  });
};

initClientSentry();
