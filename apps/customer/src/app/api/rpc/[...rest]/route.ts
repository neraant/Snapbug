import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@workspace/server/router";

import { createContext } from "@/shared/orpc/context";

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  try {
    const context = await createContext();
    const { response } = await handler.handle(request, { prefix: "/api/rpc", context });
    return response ?? new Response("Not found", { status: 404 });
  } catch (error) {
    console.error("[rpc]", error, error instanceof Error ? error.cause : undefined);
    throw error;
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
