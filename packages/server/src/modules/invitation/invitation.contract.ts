import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  acceptInvitationInputDtoSchema,
  acceptInvitationOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";
import {
  copyInvitationLinkInputDtoSchema,
  copyInvitationLinkOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/copy-invitation-link.schema";
import {
  findInvitationByTokenInputDtoSchema,
  findInvitationByTokenOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import { findInvitationsOutputDtoSchema } from "@workspace/validation/modules/invitation/dto/find-invitations.schema";
import {
  resendInvitationInputDtoSchema,
  resendInvitationOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/resend-invitation.schema";
import {
  revokeInvitationInputDtoSchema,
  revokeInvitationOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/revoke-invitation.schema";
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
  findInvitations: oc.output(findInvitationsOutputDtoSchema).route({
    method: "GET",
    path: "/invitations",
    tags: ["invitation"],
    summary: "List pending organization invitations",
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
  resendInvitation: oc
    .input(resendInvitationInputDtoSchema)
    .output(resendInvitationOutputDtoSchema)
    .route({
      method: "POST",
      path: "/invitations/resend",
      tags: ["invitation"],
      summary: "Resend a pending invitation",
      spec: sessionAuthSpec,
    }),
  revokeInvitation: oc
    .input(revokeInvitationInputDtoSchema)
    .output(revokeInvitationOutputDtoSchema)
    .route({
      method: "POST",
      path: "/invitations/revoke",
      tags: ["invitation"],
      summary: "Revoke a pending invitation",
      spec: sessionAuthSpec,
    }),
  copyInvitationLink: oc
    .input(copyInvitationLinkInputDtoSchema)
    .output(copyInvitationLinkOutputDtoSchema)
    .route({
      method: "POST",
      path: "/invitations/copy-link",
      tags: ["invitation"],
      summary: "Copy the current invitation link",
      spec: sessionAuthSpec,
    }),
};
