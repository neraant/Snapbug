import { implement } from "@orpc/server";
import {
  acceptInvitation,
  findInvitationByToken,
  sendInvitations,
} from "@workspace/server/modules/invitation/invitation.api";
import { invitationContract } from "@workspace/server/modules/invitation/invitation.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(invitationContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const invitationRouter = os.router({
  sendInvitations: authed.sendInvitations.handler(
    async ({ input, context }) => await sendInvitations(input, context.user.id, context.user.email),
  ),
  findInvitationByToken: os.findInvitationByToken.handler(async ({ input }) => await findInvitationByToken(input)),
  acceptInvitation: authed.acceptInvitation.handler(
    async ({ input, context }) => await acceptInvitation(input, context.user.id, context.user.email),
  ),
});
