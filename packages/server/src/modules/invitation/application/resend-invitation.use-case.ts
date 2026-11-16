import { InvitationEmailTemplate } from "@workspace/server/modules/invitation/email/invitation-email-template";
import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { BadRequestError, ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  ResendInvitationInputDtoType,
  ResendInvitationOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/resend-invitation.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export class ResendInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly invitationService: InvitationService,
    private readonly membershipPort: MembershipPort,
    private readonly organizationPort: OrganizationPort,
    private readonly userPort: UserPort,
    private readonly emailService: EmailService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: ResendInvitationInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<ResendInvitationOutputDtoType> {
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

    const organization = await this.organizationPort.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }

    const tokenVersion = invitation.tokenVersion + 1;
    const token = this.invitationService.buildInvitationToken(invitation.id, tokenVersion);
    const rotatedInvitation = invitation.withRotatedToken({
      tokenHash: this.invitationService.hashToken(token),
      tokenVersion,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      invitedByUserId: userId,
    });

    await this.withTransaction(async (tx) => {
      await this.invitationService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(rotatedInvitation, "Resend invitation");
    });

    const existingUser = await this.userPort.findByEmail(invitation.email);
    const recipientName = existingUser?.name?.trim() ? existingUser.name.trim() : undefined;
    const inviter = await this.userPort.findById(userId);
    const inviterName = inviter.name?.trim() ? inviter.name.trim() : inviter.email;

    await this.emailService.send({
      to: invitation.email,
      subject: `You're invited to join ${organization.name} on Snapbug`,
      react: InvitationEmailTemplate({
        inviteUrl: this.invitationService.inviteUrl(token),
        organizationName: organization.name,
        inviterName,
        role: invitation.role,
        recipientName,
      }),
    });

    return InvitationMapper.toDto(rotatedInvitation);
  }
}
