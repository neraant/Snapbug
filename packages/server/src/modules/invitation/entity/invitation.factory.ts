import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { CreateInvitationType } from "@workspace/server/modules/invitation/entity/invitation.types";
import { randomUUID } from "crypto";

export abstract class InvitationFactory {
  static create(invitation: CreateInvitationType): Invitation {
    return new Invitation({
      id: randomUUID(),
      organizationId: invitation.organizationId,
      email: invitation.email,
      token: invitation.token,
      invitedByUserId: invitation.invitedByUserId,
      expiresAt: invitation.expiresAt,
      acceptedAt: null,
      createdAt: new Date(),
    });
  }
}
