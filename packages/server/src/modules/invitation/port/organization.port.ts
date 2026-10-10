export type OrganizationPort = {
  findNameById: (organizationId: string) => Promise<string | null>;
};
