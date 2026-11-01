import { isOpenApiDocsEnabled, openAPIHandler } from "@workspace/server/orpc/handler.const";

import {
  bugReportPreflightResponse,
  isBugReportIngestPath,
  isBugReportPublicCorsPath,
  isWidgetConfigPath,
  withBugReportCors,
} from "@/shared/api/bug-report-cors.util";
import { ingestBugReportMultipart } from "@/shared/api/bug-report-multipart-ingest.util";
import { createContext } from "@/shared/orpc/context";

function isBugReportMultipartPost(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("multipart/form-data");
}

function isOpenApiDocsRequest(request: Request) {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "");
  return pathname === "/api/reference" || pathname === "/api/spec.json";
}

async function handleRequest(request: Request) {
  if (isOpenApiDocsRequest(request) && !isOpenApiDocsEnabled) {
    return new Response("Not found", { status: 404 });
  }

  if (isBugReportPublicCorsPath(request) && request.method === "OPTIONS") {
    return bugReportPreflightResponse(request);
  }

  if (isBugReportIngestPath(request) && request.method === "POST" && isBugReportMultipartPost(request)) {
    const context = await createContext();
    return withBugReportCors(await ingestBugReportMultipart(request, context));
  }

  const context = isOpenApiDocsRequest(request)
    ? {
        user: null,
        organizationId: null,
        ip: "unknown",
        actor: { type: "api-key" as const, id: null },
        requestOrigin: null,
      }
    : await createContext();
  const { matched, response } = await openAPIHandler.handle(request, {
    prefix: "/api",
    context,
  });

  if (matched) {
    if (
      (isBugReportIngestPath(request) && request.method === "POST") ||
      (isWidgetConfigPath(request) && request.method === "GET")
    ) {
      return withBugReportCors(response);
    }

    return response;
  }

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
