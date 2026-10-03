import { implement } from "@orpc/server";
import { findProjectByKey } from "@workspace/server/modules/api-key/api-key.api";
import { apiKeyContract } from "@workspace/server/modules/api-key/api-key.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(apiKeyContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const apiKeyRouter = os.router({
  findProjectByKey: os.findProjectByKey.handler(async ({ input }) => await findProjectByKey(input)),
});
