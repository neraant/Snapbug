export type ProjectAccessPort = {
  userHasProjectAccess: (userId: string, projectId: string, organizationId: string) => Promise<boolean>;
};
