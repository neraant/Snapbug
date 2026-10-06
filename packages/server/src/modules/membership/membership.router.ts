import { implement } from "@orpc/server";
import {
  createMembership,
  findMembership,
  findMembershipByUser,
} from "@workspace/server/modules/membership/membership.api";
import { membershipContract } from "@workspace/server/modules/membership/membership.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(membershipContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const membershipRouter = os.router({
  createMembership: authed.createMembership.handler(
    async ({ input, context }) => await createMembership(input, context.user.id),
  ),
  findMembership: authed.findMembership.handler(async ({ input }) => await findMembership(input)),
  findMembershipByUser: authed.findMembershipByUser.handler(
    async ({ context }) => await findMembershipByUser(context.user.id),
  ),
});
