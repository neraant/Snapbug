export type InvitationPersistedType = {
  id: string;
  organizationId: string;
  email: string;
  tokenHash: string;
  tokenVersion: number;
  invitedByUserId: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
};

export type CreateInvitationType = {
  id: string;
  organizationId: string;
  email: string;
  tokenHash: string;
  tokenVersion: number;
  invitedByUserId: string;
  expiresAt: Date;
};