import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { MembershipService } from "@workspace/server/modules/membership/service/membership.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  UpdateMembershipRoleInputDtoType,
  UpdateMembershipRoleOutputDtoType,
} from "@workspace/validation/modules/membership/dto/update-membership-role.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class UpdateMembershipRoleUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipService: MembershipService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: UpdateMembershipRoleInputDtoType,
    currentUserId: string,
    organizationId: string | null,
  ): Promise<UpdateMembershipRoleOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const currentMembership = await this.membershipRepository.findByUserAndOrganization(currentUserId, organizationId);
    if (!currentMembership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipRepository.findManyByOrganizationId(currentMembership.organizationId);
    const membership = memberships.find((item) => item.id === input.membershipId);
    if (!membership) throw new NotFoundError(ERROR_CODES.MEMBERSHIP_NOT_FOUND);
    if (membership.userId === currentUserId) {
      throw new ForbiddenError(ERROR_CODES.CANNOT_CHANGE_OWN_ROLE, "You cannot change your own role");
    }

    const adminCount = memberships.filter((item) => item.role === UserRole.ADMIN).length;
    if (membership.role === UserRole.ADMIN && input.role !== UserRole.ADMIN && adminCount === 1) {
      throw new ForbiddenError(ERROR_CODES.LAST_ADMIN_REQUIRED, "The organization must keep at least one admin");
    }

    const updatedMembership = membership.changeRole(input.role);
    await this.withTransaction(async (tx) => {
      await this.membershipService
        .withTx(tx)
        .withActor({ type: "user", id: currentUserId })
        .saveWithAudit(updatedMembership, "Update membership role");
    });

    return MembershipMapper.toDto(updatedMembership);
  }
}
