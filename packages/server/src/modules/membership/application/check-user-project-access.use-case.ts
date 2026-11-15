import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class CheckUserProjectAccessUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
  ) {}

  async execute(userId: string, projectId: string, organizationId: string): Promise<boolean> {
    const membership = await this.membershipRepository.findByUserAndOrganization(userId, organizationId);
    if (!membership) return false;
    if (membership.role === UserRole.ADMIN) return true;

    const projectAccesses = await this.projectAccessRepository.findManyByProjectId(projectId);
    return projectAccesses.some((projectAccess) => projectAccess.membershipId === membership.id);
  }
}
