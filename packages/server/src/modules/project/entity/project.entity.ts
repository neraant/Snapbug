import type { ProjectPersistedType, UpdateProjectType } from "@workspace/server/modules/project/entity/project.types";

export class Project {
  readonly id: ProjectPersistedType["id"];
  readonly name: ProjectPersistedType["name"];
  readonly slug: ProjectPersistedType["slug"];
  readonly color: ProjectPersistedType["color"];
  readonly organizationId: ProjectPersistedType["organizationId"];
  readonly defaultAssigneeId: ProjectPersistedType["defaultAssigneeId"];
  readonly storeVisitorIp: ProjectPersistedType["storeVisitorIp"];
  readonly collectVisitorEmail: ProjectPersistedType["collectVisitorEmail"];
  readonly archivedAt: ProjectPersistedType["archivedAt"];
  readonly widgetSettings: ProjectPersistedType["widgetSettings"];
  readonly createdAt: ProjectPersistedType["createdAt"];

  constructor(project: ProjectPersistedType) {
    this.id = project.id;
    this.name = project.name;
    this.slug = project.slug;
    this.color = project.color;
    this.organizationId = project.organizationId;
    this.defaultAssigneeId = project.defaultAssigneeId;
    this.storeVisitorIp = project.storeVisitorIp;
    this.collectVisitorEmail = project.collectVisitorEmail;
    this.archivedAt = project.archivedAt;
    this.widgetSettings = project.widgetSettings;
    this.createdAt = project.createdAt;
  }

  get isArchived(): boolean {
    return this.archivedAt !== null;
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
      slug: this.slug,
      color: this.color,
      organizationId: this.organizationId,
      defaultAssigneeId: this.defaultAssigneeId,
      storeVisitorIp: this.storeVisitorIp,
      collectVisitorEmail: this.collectVisitorEmail,
      archivedAt: this.archivedAt,
      widgetSettings: this.widgetSettings,
      createdAt: this.createdAt,
    };
  }
}
