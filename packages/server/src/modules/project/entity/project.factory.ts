import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { CreateProjectType } from "@workspace/server/modules/project/entity/project.types";
import { randomUUID } from "crypto";

export abstract class ProjectFactory {
  static create(project: CreateProjectType): Project {
    return new Project({
      id: randomUUID(),
      name: project.name,
      slug: project.slug,
      color: project.color,
      organizationId: project.organizationId,
      defaultAssigneeId: null,
      storeVisitorIp: false,
      collectVisitorEmail: true,
      archivedAt: null,
      widgetSettings: null,
      createdAt: new Date(),
    });
  }
}
