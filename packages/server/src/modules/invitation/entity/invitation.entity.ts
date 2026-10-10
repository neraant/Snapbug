import type { InvitationPersistedType } from "@workspace/server/modules/invitation/entity/invitation.types";

export class Invitation {
  readonly id: InvitationPersistedType["id"];
  readonly organizationId: InvitationPersistedType["organizationId"];
  readonly email: InvitationPersistedType["email"];
  readonly token: InvitationPersistedType["token"];
  readonly invitedByUserId: InvitationPersistedType["invitedByUserId"];
  readonly expiresAt: InvitationPersistedType["expiresAt"];
  readonly acceptedAt: InvitationPersistedType["acceptedAt"];
  readonly createdAt: InvitationPersistedType["createdAt"];

  constructor(invitation: InvitationPersistedType) {
    this.id = invitation.id;
    this.organizationId = invitation.organizationId;
    this.email = invitation.email;
    this.token = invitation.token;
    this.invitedByUserId = invitation.invitedByUserId;
    this.expiresAt = invitation.expiresAt;
    this.acceptedAt = invitation.acceptedAt;
    this.createdAt = invitation.createdAt;
  }

  isPending(at: Date = new Date()): boolean {
    return this.acceptedAt === null && this.expiresAt.getTime() > at.getTime();
  }

  accept(at: Date = new Date()): Invitation {
    return new Invitation({
      ...this.toObject(),
      acceptedAt: at,
    });
  }

  toObject(): InvitationPersistedType {
    return {
      id: this.id,
      organizationId: this.organizationId,
      email: this.email,
      token: this.token,
      invitedByUserId: this.invitedByUserId,
      expiresAt: this.expiresAt,
      acceptedAt: this.acceptedAt,
      createdAt: this.createdAt,
    };
  }
}
