import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { ProjectPort } from "@workspace/server/modules/membership/port/project.port";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindProjectMembersInputDtoType,
  FindProjectMembersOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-project-members.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class FindProjectMembersUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly projectPort: ProjectPort,
    private readonly userPort: UserPort,
  ) {}

  async execute(
    input: FindProjectMembersInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindProjectMembersOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const currentMembership = await this.membershipRepository.findByUserAndOrganization(userId, organizationId);
    if (!currentMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const project = await this.projectPort.findById(input.projectId);
    if (!project || project.organizationId !== organizationId) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const projectAccesses = await this.projectAccessRepository.findManyByProjectId(project.id);
    const allowedMembershipIds = new Set(projectAccesses.map((projectAccess) => projectAccess.membershipId));
    if (currentMembership.role !== UserRole.ADMIN && !allowedMembershipIds.has(currentMembership.id)) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const memberships = await this.membershipRepository.findManyByOrganizationId(organizationId);
    const visibleMemberships = memberships.filter(
      (membership) => membership.role === UserRole.ADMIN || allowedMembershipIds.has(membership.id),
    );
    const users = await this.userPort.findManyByIds(visibleMemberships.map((membership) => membership.userId));

    return MembershipMapper.toTeamMemberOutput(visibleMemberships, users);
  }
}
