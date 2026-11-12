import { container } from "@workspace/server/container";
import { AppError } from "@workspace/server/error/app-errors";
import { mcpHandler } from "@workspace/server/orpc/handler.const";

export const dynamic = "force-dynamic";

async function handleRequest(request: Request) {
  const token = readBearerToken(request);
  if (!token) {
    return Response.json({ message: "You need to sign in to continue" }, { status: 401 });
  }

  try {
    const user = await container.userToken.findUserByToken.execute({ token });
    const { response } = await mcpHandler.handle(request, {
      context: {
        user: { id: user.id, email: user.email, name: user.name },
        organizationId: null,
        ip: readClientIp(request),
        actor: { type: "mcp", id: user.id },
        requestOrigin: request.headers.get("origin"),
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AppError && error.code === "UNAUTHORIZED") {
      return Response.json({ message: error.message }, { status: 401 });
    }
    throw error;
  }
}

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  const prefix = "Bearer ";
  if (!authorization?.startsWith(prefix)) return null;

  const token = authorization.slice(prefix.length).trim();
  return token.length > 0 ? token : null;
}

function readClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export const POST = handleRequest;
