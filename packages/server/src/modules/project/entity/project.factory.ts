import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { CreateProjectType } from "@workspace/server/modules/project/entity/project.types";
import { randomUUID } from "crypto";

export abstract class ProjectFactory {
  static create(project: CreateProjectType): Project {
    return new Project({
      id: randomUUID(),
      name: project.name,
      organizationId: project.organizationId,
      createdAt: new Date(),
    });
  }
}
