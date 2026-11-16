import type { InvitationModelType } from "@workspace/validation/modules/invitation/dto/invitation.model";

export function countPendingInvitations(invitations: InvitationModelType[]): number {
  return invitations.filter((invitation) => isInvitationPending(invitation)).length;
}

export function isInvitationExpired(invitation: InvitationModelType, at = Date.now()): boolean {
  return invitation.revokedAt === null && new Date(invitation.expiresAt).getTime() <= at;
}

export function isInvitationPending(invitation: InvitationModelType, at = Date.now()): boolean {
  return invitation.revokedAt === null && new Date(invitation.expiresAt).getTime() > at;
}
