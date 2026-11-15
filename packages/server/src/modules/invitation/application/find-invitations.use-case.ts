import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindInvitationsOutputDtoType } from "@workspace/validation/modules/invitation/dto/find-invitations.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class FindInvitationsUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly membershipPort: MembershipPort,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<FindInvitationsOutputDtoType> {
    if (!organizationId) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }
    if (membership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const invitations = await this.invitationRepository.findManyPendingByOrganizationId(organizationId);
    return invitations.map((invitation) => InvitationMapper.toDto(invitation));
  }
}