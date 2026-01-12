/**
 * API route for recording and listing error logs.
 */
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/db";
import { errorLogSchema } from "@/lib/validation";

/**
 * Lists recent error logs with optional source filtering.
 */
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const errors = await prisma.appErrorLog.findMany({
    where: source ? { source } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return NextResponse.json(errors);
};

/**
 * Stores a new error log entry, optionally forwarding to Sentry.
 */
export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = errorLogSchema.parse(body);
  const entry = await prisma.appErrorLog.create({
    data: {
      source: parsed.source,
      message: parsed.message,
      stack: parsed.stack ?? null,
      metadata: parsed.metadata ?? null
    }
  });

  if (process.env.SENTRY_DSN) {
    // Forward locally captured errors to Sentry when configured.
    Sentry.captureMessage(parsed.message, {
      extra: { stack: parsed.stack, metadata: parsed.metadata, source: parsed.source }
    });
  }

  return NextResponse.json(entry);
};
