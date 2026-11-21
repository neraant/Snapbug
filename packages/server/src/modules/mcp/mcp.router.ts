import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { mcpContract } from "@workspace/server/modules/mcp/mcp.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(mcpContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const mcpRouter = os.router({
  listTools: authed.listTools.handler(async ({ context }) => await container.mcp.listTools.execute(context.user.role)),
});
