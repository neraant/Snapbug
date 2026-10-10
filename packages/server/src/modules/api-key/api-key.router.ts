import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { apiKeyContract } from "@workspace/server/modules/api-key/api-key.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(apiKeyContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const apiKeyRouter = os.router({
  findProjectByKey: os.findProjectByKey.handler(
    async ({ input }) => await container.apiKey.findProjectByKey.execute(input),
  ),
});
