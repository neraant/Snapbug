import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { identityContract } from "@workspace/server/modules/identity/identity.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(identityContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const identityRouter = os.router({
  createUser: authed.createUser.handler(async ({ input }) => await container.identity.createUser.execute(input)),
  findUserByEmail: authed.findUserByEmail.handler(
    async ({ input }) => await container.identity.findUserByEmail.execute(input.email),
  ),
});
