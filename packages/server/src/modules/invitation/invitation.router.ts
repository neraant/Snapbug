import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { invitationContract } from "@workspace/server/modules/invitation/invitation.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { adminMiddleware } from "@workspace/server/shared/orpc/require-role.middleware";

const os = implement(invitationContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);
const admin = authed.use(adminMiddleware);

export const invitationRouter = os.router({
  sendInvitations: admin.sendInvitations.handler(
    async ({ input, context }) =>
      await container.invitation.sendInvitations.execute(input, context.user.id, context.user.email),
  ),
  findInvitationByToken: os.findInvitationByToken.handler(
    async ({ input }) => await container.invitation.findInvitationByToken.execute(input),
  ),
  acceptInvitation: authed.acceptInvitation.handler(
    async ({ input, context }) =>
      await container.invitation.acceptInvitation.execute(input, context.user.id, context.user.email),
  ),
});
