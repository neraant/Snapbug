export type InvitationPersistedType = {
  id: string;
  organizationId: string;
  email: string;
  tokenHash: string;
  invitedByUserId: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
};

export type CreateInvitationType = {
  organizationId: string;
  email: string;
  tokenHash: string;
  invitedByUserId: string;
  expiresAt: Date;
};
