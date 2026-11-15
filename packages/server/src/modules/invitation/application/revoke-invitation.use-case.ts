import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { BadRequestError, ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  RevokeInvitationInputDtoType,
  RevokeInvitationOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/revoke-invitation.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class RevokeInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly invitationService: InvitationService,
    private readonly membershipPort: MembershipPort,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: RevokeInvitationInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<RevokeInvitationOutputDtoType> {
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

    const invitation = await this.invitationRepository.findById(input.invitationId);
    if (!invitation || invitation.organizationId !== organizationId) {
      throw new NotFoundError(ERROR_CODES.INVITATION_NOT_FOUND);
    }
    if (invitation.acceptedAt !== null) {
      throw new BadRequestError(ERROR_CODES.INVALID_INVITATION_TOKEN);
    }
    if (invitation.revokedAt !== null) {
      return InvitationMapper.toDto(invitation);
    }

    const revokedInvitation = invitation.revoke();

    await this.withTransaction(async (tx) => {
      await this.invitationService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(revokedInvitation, "Revoke invitation");
    });

    return InvitationMapper.toDto(revokedInvitation);
  }
}