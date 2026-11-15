export type ProjectApiKeyPort = {
  withTx: (tx: unknown) => ProjectApiKeyPort;
  deleteByProjectId: (projectId: string) => Promise<void>;
};
