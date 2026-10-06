import type { ProjectPersistedType, UpdateProjectType } from "@workspace/server/modules/project/entity/project.types";

export class Project {
  readonly id: ProjectPersistedType["id"];
  readonly name: ProjectPersistedType["name"];
  readonly organizationId: ProjectPersistedType["organizationId"];
  readonly createdAt: ProjectPersistedType["createdAt"];

  constructor(project: ProjectPersistedType) {
    this.id = project.id;
    this.name = project.name;
    this.organizationId = project.organizationId;
    this.createdAt = project.createdAt;
  }

  update(patch: UpdateProjectType): Project {
    return new Project({
      ...this.toObject(),
      ...patch,
      id: this.id,
      organizationId: this.organizationId,
      createdAt: this.createdAt,
    });
  }

  toObject(): ProjectPersistedType {
    return {
      id: this.id,
      name: this.name,
      organizationId: this.organizationId,
      createdAt: this.createdAt,
    };
  }
}
