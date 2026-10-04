import { isOpenApiDocsEnabled, openAPIHandler } from "@workspace/server/orpc/handler.const";

import { createContext } from "@/shared/orpc/context";

function isOpenApiDocsRequest(request: Request) {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "");
  return pathname === "/api/reference" || pathname === "/api/spec.json";
}

async function handleRequest(request: Request) {
  if (isOpenApiDocsRequest(request) && !isOpenApiDocsEnabled) {
    return new Response("Not found", { status: 404 });
  }

  const context = isOpenApiDocsRequest(request) ? { user: null, ip: "unknown" } : await createContext();
  const { matched, response } = await openAPIHandler.handle(request, {
    prefix: "/api",
    context,
  });

  if (matched) {
    return response;
  }

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
