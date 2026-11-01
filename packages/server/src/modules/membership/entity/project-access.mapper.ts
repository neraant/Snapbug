import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { ProjectAccessPersistedType } from "@workspace/server/modules/membership/entity/project-access.types";
import type { FindMembershipProjectAccessOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-project-access.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export abstract class ProjectAccessMapper {
  static fromPersistence(row: ProjectAccessPersistedType): ProjectAccess {
    return new ProjectAccess(row);
  }

  static toPersistence(projectAccess: ProjectAccess): ProjectAccessPersistedType {
    return projectAccess.toObject();
  }

  static toAudit(projectAccess: ProjectAccess): Record<string, unknown> {
    const { membershipId, projectId, createdAt } = projectAccess.toObject();
    return { membershipId, projectId, createdAt };
  }

  static toMembershipProjectAccess(
    membership: Pick<MembershipModelType, "id" | "role">,
    projects: Array<Pick<ProjectModelType, "id" | "name" | "color">>,
    allowedProjectIds: ReadonlySet<string>,
  ): FindMembershipProjectAccessOutputDtoType {
    const locked = membership.role === UserRole.ADMIN;

    return {
      membershipId: membership.id,
      role: membership.role,
      locked,
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
        allowed: locked || allowedProjectIds.has(project.id),
      })),
    };
  }
}
