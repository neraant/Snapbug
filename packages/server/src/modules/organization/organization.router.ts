import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { organizationContract } from "@workspace/server/modules/organization/organization.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(organizationContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const organizationRouter = os.router({
  createOrganization: authed.createOrganization.handler(
    async ({ input, context }) => await container.organization.createOrganization.execute(input, context.user.id),
  ),
  updateOrganization: authed.updateOrganization.handler(
    async ({ input, context }) => await container.organization.updateOrganization.execute(input, context.user.id),
  ),
  findOnboarding: authed.findOnboarding.handler(
    async ({ context }) => await container.organization.findOnboarding.execute(context.user.id),
  ),
  completeOnboarding: authed.completeOnboarding.handler(
    async ({ input, context }) => await container.organization.completeOnboarding.execute(input, context.user.id),
  ),
});
