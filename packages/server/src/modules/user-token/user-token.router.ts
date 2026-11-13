import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { userTokenContract } from "@workspace/server/modules/user-token/user-token.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(userTokenContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const userTokenRouter = os.router({
  create: authed.create.handler(async ({ context }) => await container.userToken.create.execute(context.user.id)),
  findMany: authed.findMany.handler(async ({ context }) => await container.userToken.findMany.execute(context.user.id)),
  revoke: authed.revoke.handler(
    async ({ input, context }) => await container.userToken.revoke.execute(input, context.user.id),
  ),
  findUserByToken: os.findUserByToken.handler(
    async ({ input }) => await container.userToken.findUserByToken.execute(input),
  ),
});
