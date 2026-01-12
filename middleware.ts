/**
 * Middleware to attach request IDs and structured request logging.
 */
import { NextRequest, NextResponse } from "next/server";
import { createRequestId, logEvent } from "@/lib/logger";

/**
 * Adds a request id header and logs request details for traceability.
 */
export const middleware = (request: NextRequest) => {
  const requestId = createRequestId();
  const response = NextResponse.next();

  response.headers.set("x-request-id", requestId);

  // Log minimal request info for self-hosted debugging.
  logEvent("info", "request", {
    requestId,
    scope: "http",
    metadata: {
      method: request.method,
      pathname: request.nextUrl.pathname
    }
  });

  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
