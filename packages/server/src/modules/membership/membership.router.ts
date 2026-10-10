import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { membershipContract } from "@workspace/server/modules/membership/membership.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(membershipContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const membershipRouter = os.router({
  createMembership: authed.createMembership.handler(
    async ({ input, context }) => await container.membership.createMembership.execute(input, context.user.id),
  ),
  findMembership: authed.findMembership.handler(
    async ({ input }) => await container.membership.findMembership.execute(input),
  ),
  findMembershipByUser: authed.findMembershipByUser.handler(
    async ({ context }) => await container.membership.findMembershipByUser.execute(context.user.id),
  ),
});
