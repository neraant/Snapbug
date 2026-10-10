import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  acceptInvitationInputDtoSchema,
  acceptInvitationOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";
import {
  findInvitationByTokenInputDtoSchema,
  findInvitationByTokenOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import {
  sendInvitationsInputDtoSchema,
  sendInvitationsOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/send-invitation.schema";

export const invitationContract = {
  sendInvitations: oc
    .input(sendInvitationsInputDtoSchema)
    .output(sendInvitationsOutputDtoSchema)
    .route({
      method: "POST",
      path: "/invitations",
      tags: ["invitation"],
      summary: "Send organization invitations by email",
      spec: sessionAuthSpec,
    }),
  findInvitationByToken: oc
    .input(findInvitationByTokenInputDtoSchema)
    .output(findInvitationByTokenOutputDtoSchema)
    .route({
      method: "GET",
      path: "/invitations/by-token",
      tags: ["invitation"],
      summary: "Find invitation details for a token",
    }),
  acceptInvitation: oc
    .input(acceptInvitationInputDtoSchema)
    .output(acceptInvitationOutputDtoSchema)
    .route({
      method: "POST",
      path: "/invitations/accept",
      tags: ["invitation"],
      summary: "Accept an invitation for the current user",
      spec: sessionAuthSpec,
    }),
};
