import { ProjectAccessMapper } from "@workspace/server/modules/membership/entity/project-access.mapper";
import type { ProjectPort } from "@workspace/server/modules/membership/port/project.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindMembershipProjectAccessInputDtoType,
  FindMembershipProjectAccessOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership-project-access.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class FindMembershipProjectAccessUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly projectPort: ProjectPort,
  ) {}

  async execute(
    input: FindMembershipProjectAccessInputDtoType,
    currentUserId: string,
    organizationId: string | null,
  ): Promise<FindMembershipProjectAccessOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const currentMembership = await this.membershipRepository.findByUserAndOrganization(currentUserId, organizationId);
    if (!currentMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipRepository.findManyByOrganizationId(currentMembership.organizationId);
    const membership = memberships.find((item) => item.id === input.membershipId);
    if (!membership) throw new NotFoundError(ERROR_CODES.MEMBERSHIP_NOT_FOUND);

    const projects = await this.projectPort.findManyByOrganizationId({
      organizationId: currentMembership.organizationId,
    });
    const allowedProjectIds =
      membership.role === UserRole.ADMIN
        ? []
        : (await this.projectAccessRepository.findManyByMembershipId(membership.id)).map(
            (projectAccess) => projectAccess.projectId,
          );

    return ProjectAccessMapper.toMembershipProjectAccess(membership, projects, new Set(allowedProjectIds));
  }
}
