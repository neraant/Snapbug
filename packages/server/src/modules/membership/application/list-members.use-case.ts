import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
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
    private readonly userPort: UserPort,
  ) {}

  async execute(
    input: ListMembersInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<ListMembersOutputDtoType> {
    const resolvedOrganizationId = input.organizationId ?? organizationId;
    if (!resolvedOrganizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const callerMembership = await this.membershipRepository.findByUserAndOrganization(userId, resolvedOrganizationId);
    if (!callerMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipRepository.findManyByOrganizationId(resolvedOrganizationId);
    const users = await this.userPort.findManyByIds(memberships.map((membership) => membership.userId));
    const team = MembershipMapper.toTeamMemberOutput(memberships, users);
    const includeEmail = callerMembership.role === UserRole.ADMIN;

    return team.map((member) => ({
      userId: member.userId,
      name: member.name,
      role: member.role,
      ...(includeEmail ? { email: member.email } : {}),
    }));
  }
}