import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { CreateInvitationType } from "@workspace/server/modules/invitation/entity/invitation.types";

export abstract class InvitationFactory {
  static create(invitation: CreateInvitationType): Invitation {
    return new Invitation({
      id: invitation.id,
      organizationId: invitation.organizationId,
      email: invitation.email,
      tokenHash: invitation.tokenHash,
      tokenVersion: invitation.tokenVersion,
      invitedByUserId: invitation.invitedByUserId,
      expiresAt: invitation.expiresAt,
      acceptedAt: null,
      revokedAt: null,
      createdAt: new Date(),
    });
  }
}