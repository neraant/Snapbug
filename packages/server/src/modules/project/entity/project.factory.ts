import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { CreateProjectType } from "@workspace/server/modules/project/entity/project.types";
import { randomUUID } from "crypto";

export abstract class ProjectFactory {
  static create(project: CreateProjectType): Project {
    return new Project({
      id: randomUUID(),
      name: project.name,
      color: project.color,
      organizationId: project.organizationId,
      widgetSettings: null,
      createdAt: new Date(),
    });
  }
}
