import type { InvitationPersistedType } from "@workspace/server/modules/invitation/entity/invitation.types";

export class Invitation {
  readonly id: InvitationPersistedType["id"];
  readonly organizationId: InvitationPersistedType["organizationId"];
  readonly email: InvitationPersistedType["email"];
  readonly tokenHash: InvitationPersistedType["tokenHash"];
  readonly tokenVersion: InvitationPersistedType["tokenVersion"];
  readonly invitedByUserId: InvitationPersistedType["invitedByUserId"];
  readonly expiresAt: InvitationPersistedType["expiresAt"];
  readonly acceptedAt: InvitationPersistedType["acceptedAt"];
  readonly revokedAt: InvitationPersistedType["revokedAt"];
  readonly createdAt: InvitationPersistedType["createdAt"];

  constructor(invitation: InvitationPersistedType) {
    this.id = invitation.id;
    this.organizationId = invitation.organizationId;
    this.email = invitation.email;
    this.tokenHash = invitation.tokenHash;
    this.tokenVersion = invitation.tokenVersion;
    this.invitedByUserId = invitation.invitedByUserId;
    this.expiresAt = invitation.expiresAt;
    this.acceptedAt = invitation.acceptedAt;
    this.revokedAt = invitation.revokedAt;
    this.createdAt = invitation.createdAt;
  }

  isPending(at: Date = new Date()): boolean {
    return (
      this.acceptedAt === null && this.revokedAt === null && this.expiresAt.getTime() > at.getTime()
    );
  }

  accept(at: Date = new Date()): Invitation {
    return new Invitation({
      ...this.toObject(),
      acceptedAt: at,
    });
  }

  revoke(revokedAt: Date = new Date()): Invitation {
    return new Invitation({
      ...this.toObject(),
      revokedAt,
    });
  }

  withRotatedToken(input: {
    tokenHash: string;
    tokenVersion: number;
    expiresAt: Date;
    invitedByUserId: string;
  }): Invitation {
    return new Invitation({
      ...this.toObject(),
      tokenHash: input.tokenHash,
      tokenVersion: input.tokenVersion,
      expiresAt: input.expiresAt,
      invitedByUserId: input.invitedByUserId,
      revokedAt: null,
    });
  }

  toObject(): InvitationPersistedType {
    return {
      id: this.id,
      organizationId: this.organizationId,
      email: this.email,
      tokenHash: this.tokenHash,
      tokenVersion: this.tokenVersion,
      invitedByUserId: this.invitedByUserId,
      expiresAt: this.expiresAt,
      acceptedAt: this.acceptedAt,
      revokedAt: this.revokedAt,
      createdAt: this.createdAt,
    };
  }
}