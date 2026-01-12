/**
 * Structured logging helpers for server requests and error events.
 */
import { randomUUID } from "crypto";

export type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  scope?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Creates a request identifier for log correlation.
 */
export const createRequestId = (): string => {
  return randomUUID();
};

/**
 * Writes a structured log line to stdout for ingestion by log tools.
 */
export const logEvent = (level: LogLevel, message: string, context: LogContext = {}): void => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    scope: context.scope,
    metadata: context.metadata
  };

  // Log as JSON for easier parsing in self-hosted environments.
  console[level === "error" ? "error" : "log"](JSON.stringify(payload));
};
