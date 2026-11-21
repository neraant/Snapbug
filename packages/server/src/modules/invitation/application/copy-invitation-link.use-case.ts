import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import { BadRequestError, ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CopyInvitationLinkInputDtoType,
  CopyInvitationLinkOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/copy-invitation-link.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class CopyInvitationLinkUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly invitationService: InvitationService,
    private readonly membershipPort: MembershipPort,
  ) {}

  async execute(
    input: CopyInvitationLinkInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<CopyInvitationLinkOutputDtoType> {
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
      throw new BadRequestError(ERROR_CODES.INVALID_INVITATION_TOKEN);
    }

    const token = this.invitationService.buildInvitationToken(invitation.id, invitation.tokenVersion);
    const expectedHash = this.invitationService.hashToken(token);
    if (expectedHash !== invitation.tokenHash) {
      throw new BadRequestError(ERROR_CODES.INVALID_INVITATION_TOKEN);
    }

    return { inviteUrl: this.invitationService.inviteUrl(token) };
  }
}
