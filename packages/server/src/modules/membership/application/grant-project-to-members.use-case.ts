import { ProjectAccessFactory } from "@workspace/server/modules/membership/entity/project-access.factory";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";

export class GrantProjectToMembersUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly projectAccessService: ProjectAccessService,
  ) {}

  async execute(organizationId: string, projectId: string, userId: string): Promise<void> {
    const memberships = await this.membershipRepository.findManyByOrganizationId(organizationId);
    if (memberships.length === 0) return;

    const existing = await this.projectAccessRepository.findManyByProjectId(projectId);
    const grantedMembershipIds = new Set(existing.map((projectAccess) => projectAccess.membershipId));
    const service = this.projectAccessService.withActor({ type: "user", id: userId });

    for (const membership of memberships) {
      if (grantedMembershipIds.has(membership.id)) continue;

      await service.saveWithAudit(
        ProjectAccessFactory.create({ membershipId: membership.id, projectId }),
        "Grant project access",
      );
    }
  }
}
