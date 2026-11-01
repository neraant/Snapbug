import { ProjectAccessFactory } from "@workspace/server/modules/membership/entity/project-access.factory";
import { ProjectAccessMapper } from "@workspace/server/modules/membership/entity/project-access.mapper";
import type { ProjectPort } from "@workspace/server/modules/membership/port/project.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  ReplaceMembershipProjectAccessInputDtoType,
  ReplaceMembershipProjectAccessOutputDtoType,
} from "@workspace/validation/modules/membership/dto/replace-membership-project-access.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class ReplaceMembershipProjectAccessUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly projectPort: ProjectPort,
    private readonly projectAccessService: ProjectAccessService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: ReplaceMembershipProjectAccessInputDtoType,
    currentUserId: string,
    organizationId: string | null,
  ): Promise<ReplaceMembershipProjectAccessOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const currentMembership = await this.membershipRepository.findByUserAndOrganization(currentUserId, organizationId);
    if (!currentMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipRepository.findManyByOrganizationId(currentMembership.organizationId);
    const membership = memberships.find((item) => item.id === input.membershipId);
    if (!membership) throw new NotFoundError(ERROR_CODES.MEMBERSHIP_NOT_FOUND);
    if (membership.userId === currentUserId) {
      throw new ForbiddenError(
        ERROR_CODES.CANNOT_CHANGE_OWN_PROJECT_ACCESS,
        "You cannot change your own project access",
      );
    }
    if (membership.role === UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.CANNOT_RESTRICT_ADMIN, "Admins have access to every project");
    }

    const projects = await this.projectPort.findManyByOrganizationId({
      organizationId: currentMembership.organizationId,
    });
    const projectIds = [...new Set(input.projectIds)];
    const organizationProjectIds = new Set(projects.map((project) => project.id));
    if (projectIds.some((projectId) => !organizationProjectIds.has(projectId))) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const existing = await this.projectAccessRepository.findManyByMembershipId(membership.id);
    const requestedProjectIds = new Set(projectIds);
    const keptProjectIds = new Set<string>();
    const removed = existing.filter((projectAccess) => {
      if (!requestedProjectIds.has(projectAccess.projectId) || keptProjectIds.has(projectAccess.projectId)) {
        return true;
      }

      keptProjectIds.add(projectAccess.projectId);
      return false;
    });
    const addedProjectIds = projectIds.filter((projectId) => !keptProjectIds.has(projectId));

    await this.withTransaction(async (tx) => {
      const service = this.projectAccessService.withTx(tx).withActor({ type: "user", id: currentUserId });

      for (const projectAccess of removed) {
        await service.deleteWithAudit(projectAccess, "Remove project access");
      }

      for (const projectId of addedProjectIds) {
        await service.saveWithAudit(
          ProjectAccessFactory.create({ membershipId: membership.id, projectId }),
          "Grant project access",
        );
      }
    });

    return ProjectAccessMapper.toMembershipProjectAccess(membership, projects, requestedProjectIds);
  }
}
