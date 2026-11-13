import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { apiKeyContract } from "@workspace/server/modules/api-key/api-key.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { adminMiddleware } from "@workspace/server/shared/orpc/require-role.middleware";

const os = implement(apiKeyContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);
const admin = authed.use(adminMiddleware);

export const apiKeyRouter = os.router({
  findProjectByKey: os.findProjectByKey.handler(
    async ({ input }) => await container.apiKey.findProjectByKey.execute(input),
  ),
  findProjectApiKey: authed.findProjectApiKey.handler(
    async ({ input, context }) =>
      await container.apiKey.findProjectApiKey.execute(input, context.user.id, context.organizationId),
  ),
  rotateProjectApiKey: admin.rotateProjectApiKey.handler(
    async ({ input, context }) =>
      await container.apiKey.rotateProjectApiKey.execute(input, context.user.id, context.organizationId),
  ),
});
