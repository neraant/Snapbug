import { implement } from "@orpc/server";
import { findMembership } from "@workspace/server/modules/membership/membership.api";
import { membershipContract } from "@workspace/server/modules/membership/membership.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(membershipContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const membershipRouter = os.router({
  findMembership: os.findMembership.handler(async ({ input }) => await findMembership(input)),
});
