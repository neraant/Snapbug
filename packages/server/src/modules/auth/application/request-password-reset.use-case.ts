import { ResetPasswordFactory } from "@workspace/server/modules/auth/domain/reset-password.factory";
import { ResetPasswordEmailTemplate } from "@workspace/server/modules/auth/email/reset-password-email-template";
import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import type {
  RequestResetPasswordInputDtoType,
  RequestResetPasswordOutputDtoType,
} from "@workspace/validation/modules/auth/dto/request-reset-password.schema";

const TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes

export class RequestPasswordResetUseCase {
  constructor(
    private readonly resetPasswordRepository: ResetPasswordRepository,
    private readonly userPort: UserPort,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: RequestResetPasswordInputDtoType): Promise<RequestResetPasswordOutputDtoType> {
    const user = await this.userPort.findByEmail(input.email);
    if (!user) {
      // Spend a similar amount of time as the success path so the response does not reveal the account.
      await this.authService.generatePasswordResetToken();
      return;
    }

    const token = await this.authService.generatePasswordResetToken();
    const resetPassword = ResetPasswordFactory.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });

    await this.withTransaction(async (tx) => {
      const resetPasswordRepository = this.resetPasswordRepository.withTx(tx);
      const existingResetPassword = await resetPasswordRepository.findByUserId(user.id);
      if (existingResetPassword) {
        await resetPasswordRepository.delete(existingResetPassword);
      }
      await resetPasswordRepository.save(resetPassword);
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetPath = input.invitation
      ? `/reset-password?${new URLSearchParams({ token, invitation: input.invitation }).toString()}`
      : `/reset-password?${new URLSearchParams({ token }).toString()}`;
    const resetUrl = `${appUrl}${resetPath}`;

    await this.emailService.send({
      to: user.email,
      subject: "Reset your password",
      react: ResetPasswordEmailTemplate({ resetUrl }),
    });
  }
}
