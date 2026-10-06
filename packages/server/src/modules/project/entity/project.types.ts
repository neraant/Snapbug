export type ProjectPersistedType = {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
};

export type CreateProjectType = Pick<ProjectPersistedType, "name" | "organizationId">;

export type UpdateProjectType = Pick<ProjectPersistedType, "name">;
