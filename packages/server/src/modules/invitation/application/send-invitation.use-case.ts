import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { InvitationEmailTemplate } from "@workspace/server/modules/invitation/email/invitation-email-template";
import { InvitationFactory } from "@workspace/server/modules/invitation/entity/invitation.factory";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  SendInvitationsInputDtoType,
  SendInvitationsOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/send-invitation.schema";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function normalizeEmails(emails: string[]): string[] {
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

export class SendInvitationsUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
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

    const normalizedInviterEmail = inviterEmail.toLowerCase();
    const emails = normalizeEmails(input.emails);

    for (const email of emails) {
      if (email === normalizedInviterEmail) continue;

      const existingUser = await this.userPort.findByEmail(email);
      if (existingUser) {
        const membership = await this.membershipPort.findByUserAndOrganization({
          userId: existingUser.id,
          organizationId: input.organizationId,
        });
        if (membership) continue;
      }

      const token = await this.authService.generatePasswordResetToken();
      const invitation = InvitationFactory.create({
        organizationId: input.organizationId,
        email,
        token,
        invitedByUserId: userId,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      });

      await this.invitationRepository.upsertPending(invitation);

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const inviteUrl = `${appUrl}/sign-up?invitation=${token}`;

      await this.emailService.send({
        to: email,
        subject: "You're invited to join a team on Snapbug",
        react: InvitationEmailTemplate({ inviteUrl }),
      });
    }
  }
}
