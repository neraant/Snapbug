export type ApiKeyPersistedType = {
  id: string;
  projectId: string;
  key: string;
  createdAt: Date;
  revokedAt: Date | null;
};
