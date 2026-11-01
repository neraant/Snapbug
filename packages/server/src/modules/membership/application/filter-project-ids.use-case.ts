import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class FilterProjectIdsUseCase {
  constructor(private readonly projectAccessRepository: ProjectAccessRepository) {}

  async execute(membership: Pick<MembershipModelType, "id" | "role">, projectIds: string[]): Promise<string[]> {
    if (projectIds.length === 0 || membership.role === UserRole.ADMIN) return projectIds;

    const projectAccesses = await this.projectAccessRepository.findManyByMembershipId(membership.id);
    const allowedProjectIds = new Set(projectAccesses.map((projectAccess) => projectAccess.projectId));
    return projectIds.filter((projectId) => allowedProjectIds.has(projectId));
  }
}
