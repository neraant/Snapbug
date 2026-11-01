import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { CreateProjectAccessType } from "@workspace/server/modules/membership/entity/project-access.types";
import { randomUUID } from "crypto";

export abstract class ProjectAccessFactory {
  static create(projectAccess: CreateProjectAccessType): ProjectAccess {
    return new ProjectAccess({
      id: randomUUID(),
      membershipId: projectAccess.membershipId,
      projectId: projectAccess.projectId,
      createdAt: new Date(),
    });
  }
}
