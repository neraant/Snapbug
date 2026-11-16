import { InvitationEmailTemplate } from "@workspace/server/modules/invitation/email/invitation-email-template";
import { InvitationFactory } from "@workspace/server/modules/invitation/entity/invitation.factory";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { ProjectPort } from "@workspace/server/modules/invitation/port/project.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { BadRequestError, ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  SendInvitationsInputDtoType,
  SendInvitationsOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/send-invitation.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { randomUUID } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const INITIAL_TOKEN_VERSION = 1;

export class SendInvitationsUseCase {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly invitationRepository: InvitationRepository,
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly organizationPort: OrganizationPort,
    private readonly projectPort: ProjectPort,
    private readonly emailService: EmailService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: SendInvitationsInputDtoType,
    userId: string,
    inviterEmail: string,
  ): Promise<SendInvitationsOutputDtoType> {
    const inviterMembership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!inviterMembership) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }
    if (inviterMembership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const organization = await this.organizationPort.findById(input.organizationId);
    if (!organization) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }

    const inviter = await this.userPort.findById(userId);
    const inviterName = inviter.name?.trim() ? inviter.name.trim() : inviter.email;

    const storedProjectIds = await this.resolveStoredProjectIds(input.organizationId, input.role, input.projectIds);
    const normalizedInviterEmail = inviterEmail.toLowerCase();
    const emails = this.normalizeEmails(input.emails);
    let sent = 0;
    let skipped = 0;
    let skippedAlreadyMember = 0;
    let resent = 0;

    for (const email of emails) {
      if (email === normalizedInviterEmail) {
        skipped += 1;
        continue;
      }

      const existingUser = await this.userPort.findByEmail(email);
      if (existingUser) {
        const membership = await this.membershipPort.findByUserAndOrganization({
          userId: existingUser.id,
          organizationId: input.organizationId,
        });
        if (membership) {
          skipped += 1;
          skippedAlreadyMember += 1;
          continue;
        }
      }

      const recipientName = this.recipientName(existingUser);
      const existingInvitation = await this.invitationRepository.findByOrganizationAndEmail(
        input.organizationId,
        email,
      );

      if (existingInvitation?.isPending()) {
        const tokenVersion = existingInvitation.tokenVersion + 1;
        const token = this.invitationService.buildInvitationToken(existingInvitation.id, tokenVersion);
        const rotatedInvitation = existingInvitation
          .withInviteAccess({ role: input.role, projectIds: storedProjectIds })
          .withRotatedToken({
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

        await this.emailService.send({
          to: email,
          subject: `You're invited to join ${organization.name} on Snapbug`,
          react: InvitationEmailTemplate({
            inviteUrl: this.invitationService.inviteUrl(token),
            organizationName: organization.name,
            inviterName,
            role: input.role,
            recipientName,
          }),
        });
        resent += 1;
        continue;
      }

      const invitationId = randomUUID();
      const token = this.invitationService.buildInvitationToken(invitationId, INITIAL_TOKEN_VERSION);
      const invitation = InvitationFactory.create({
        id: invitationId,
        organizationId: input.organizationId,
        email,
        tokenHash: this.invitationService.hashToken(token),
        tokenVersion: INITIAL_TOKEN_VERSION,
        invitedByUserId: userId,
        role: input.role,
        projectIds: storedProjectIds,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      });

      await this.withTransaction(async (tx) => {
        await this.invitationService
          .withTx(tx)
          .withActor({ type: "user", id: userId })
          .saveWithAudit(invitation, "Send invitation");
      });

      await this.emailService.send({
        to: email,
        subject: `You're invited to join ${organization.name} on Snapbug`,
        react: InvitationEmailTemplate({
          inviteUrl: this.invitationService.inviteUrl(token),
          organizationName: organization.name,
          inviterName,
          role: input.role,
          recipientName,
        }),
      });
      sent += 1;
    }

    return { sent, skipped, skippedAlreadyMember, resent };
  }

  private async resolveStoredProjectIds(
    organizationId: string,
    role: SendInvitationsInputDtoType["role"],
    requestedProjectIds: string[],
  ): Promise<string[]> {
    const projects = await this.projectPort.findManyByOrganizationId({ organizationId });
    const organizationProjectIds = new Set(projects.map((project) => project.id));

    if (role === UserRole.ADMIN) {
      return projects.map((project) => project.id);
    }

    const uniqueProjectIds = [...new Set(requestedProjectIds)];
    if (uniqueProjectIds.some((projectId) => !organizationProjectIds.has(projectId))) {
      throw new BadRequestError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    return uniqueProjectIds;
  }

  private recipientName(user: { name: string | null } | null): string | undefined {
    const name = user?.name?.trim();
    return name ? name : undefined;
  }

  private normalizeEmails(emails: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const raw of emails) {
      const email = raw.toLowerCase();
      if (!email || seen.has(email)) continue;
      seen.add(email);
      result.push(email);
    }

    return result;
  }
}
