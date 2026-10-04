import { findProjectByKey } from "@workspace/server/modules/api-key/api-key.api";
import { mcpHandler } from "@workspace/server/orpc/handler.const";

export const dynamic = "force-dynamic";

async function handleRequest(request: Request) {
  const key = readApiKey(request);
  if (!key) {
    return Response.json({ message: "This API key is invalid" }, { status: 401 });
  }

  const project = await findProjectByKey({ key });
  if (!project) {
    return Response.json({ message: "This API key is invalid" }, { status: 401 });
  }

  const { response } = await mcpHandler.handle(request, { context: { user: null, ip: "unknown" } });
  return response;
}

function readApiKey(request: Request): string | null {
  const header = request.headers.get("x-api-key");
  if (header) return header;

  const authorization = request.headers.get("authorization");
  const prefix = "Bearer ";
  if (authorization?.startsWith(prefix)) {
    const key = authorization.slice(prefix.length).trim();
    return key.length > 0 ? key : null;
  }

  return null;
}

export const POST = handleRequest;
