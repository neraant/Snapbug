import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindTeamMembersOutputDtoType } from "@workspace/validation/modules/membership/dto/find-team-members.schema";

export class FindTeamMembersUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly userPort: UserPort,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<FindTeamMembersOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const currentMembership = await this.membershipRepository.findByUserAndOrganization(userId, organizationId);
    if (!currentMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipRepository.findManyByOrganizationId(currentMembership.organizationId);
    const users = await this.userPort.findManyByIds(memberships.map((membership) => membership.userId));

    return MembershipMapper.toTeamMemberOutput(memberships, users);
  }
}
