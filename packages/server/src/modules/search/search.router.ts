import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { searchContract } from "@workspace/server/modules/search/search.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(searchContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const searchRouter = os.router({
  search: authed.search.handler(
    async ({ input, context }) =>
      await container.search.search.execute(input, context.user.id, context.organizationId, context.mcp?.projectIds),
  ),
});
