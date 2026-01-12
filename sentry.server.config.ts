/**
 * Server-side Sentry configuration (optional when SENTRY_DSN is set).
 */
import * as Sentry from "@sentry/nextjs";

/**
 * Initializes Sentry only when DSN is provided.
 */
export const initServerSentry = () => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1
  });
};

initServerSentry();
