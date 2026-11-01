import { ProjectAccessFactory } from "@workspace/server/modules/membership/entity/project-access.factory";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";

export class GrantMembershipProjectsUseCase {
  constructor(
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly projectAccessService: ProjectAccessService,
  ) {}

  async execute(membershipId: string, projectIds: string[], userId: string): Promise<void> {
    const uniqueProjectIds = [...new Set(projectIds)];
    if (uniqueProjectIds.length === 0) return;

    const existing = await this.projectAccessRepository.findManyByMembershipId(membershipId);
    const grantedProjectIds = new Set(existing.map((projectAccess) => projectAccess.projectId));
    const service = this.projectAccessService.withActor({ type: "user", id: userId });

    for (const projectId of uniqueProjectIds) {
      if (grantedProjectIds.has(projectId)) continue;

      await service.saveWithAudit(ProjectAccessFactory.create({ membershipId, projectId }), "Grant project access");
    }
  }
}
