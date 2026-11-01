import type { ProjectAccessPersistedType } from "@workspace/server/modules/membership/entity/project-access.types";

export class ProjectAccess {
  readonly id: ProjectAccessPersistedType["id"];
  readonly membershipId: ProjectAccessPersistedType["membershipId"];
  readonly projectId: ProjectAccessPersistedType["projectId"];
  readonly createdAt: ProjectAccessPersistedType["createdAt"];

  constructor(projectAccess: ProjectAccessPersistedType) {
    this.id = projectAccess.id;
    this.membershipId = projectAccess.membershipId;
    this.projectId = projectAccess.projectId;
    this.createdAt = projectAccess.createdAt;
  }

  toObject(): ProjectAccessPersistedType {
    return {
      id: this.id,
      membershipId: this.membershipId,
      projectId: this.projectId,
      createdAt: this.createdAt,
    };
  }
}
