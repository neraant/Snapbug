import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  ListMembersInputDtoType,
  ListMembersOutputDtoType,
} from "@workspace/validation/modules/membership/dto/list-members.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class ListMembersUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly userPort: UserPort,
  ) {}

  async execute(
    input: ListMembersInputDtoType,
    userId: string,
    organizationId: string | null,
    mcpProjectIds?: string[] | null,
  ): Promise<ListMembersOutputDtoType> {
    const resolvedOrganizationId = input.organizationId ?? organizationId;
    if (!resolvedOrganizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const callerMembership = await this.membershipRepository.findByUserAndOrganization(userId, resolvedOrganizationId);
    if (!callerMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipRepository.findManyByOrganizationId(resolvedOrganizationId);
    const visibleMemberships =
      mcpProjectIds && mcpProjectIds.length > 0
        ? await this.filterMembershipsByMcpProjects(memberships, mcpProjectIds)
        : memberships;
    const users = await this.userPort.findManyByIds(visibleMemberships.map((membership) => membership.userId));
    const team = MembershipMapper.toTeamMemberOutput(visibleMemberships, users);
    const includeEmail = callerMembership.role === UserRole.ADMIN;

    return team.map((member) => ({
      userId: member.userId,
      name: member.name,
      role: member.role,
      ...(includeEmail ? { email: member.email } : {}),
    }));
  }

  private async filterMembershipsByMcpProjects(
    memberships: Awaited<ReturnType<MembershipRepository["findManyByOrganizationId"]>>,
    mcpProjectIds: string[],
  ) {
    const allowedMembershipIds = new Set<string>();
    for (const projectId of mcpProjectIds) {
      const projectAccesses = await this.projectAccessRepository.findManyByProjectId(projectId);
      for (const projectAccess of projectAccesses) {
        allowedMembershipIds.add(projectAccess.membershipId);
      }
    }

    return memberships.filter(
      (membership) => membership.role === UserRole.ADMIN || allowedMembershipIds.has(membership.id),
    );
  }
}
