export type UserTokenPersistedType = {
  id: string;
  userId: string;
  tokenHash: string;
  prefix: string;
  createdAt: Date;
  revokedAt: Date | null;
};
