export type ProjectAccessPersistedType = {
  id: string;
  membershipId: string;
  projectId: string;
  createdAt: Date;
};

export type CreateProjectAccessType = Pick<ProjectAccessPersistedType, "membershipId" | "projectId">;
