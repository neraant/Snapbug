export type OrganizationPersistedType = {
  id: string;
  name: string;
  reports_retention_days: number;
  createdAt: Date;
};

export type CreateOrganizationType = Pick<OrganizationPersistedType, "name"> &
  Partial<Pick<OrganizationPersistedType, "reports_retention_days">>;

export type UpdateOrganizationType = Partial<Pick<OrganizationPersistedType, "name" | "reports_retention_days">>;
