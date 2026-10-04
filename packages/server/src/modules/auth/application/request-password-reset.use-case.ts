import { ResetPasswordFactory } from "@workspace/server/modules/auth/domain/reset-password.factory";
import { ResetPasswordEmailTemplate } from "@workspace/server/modules/auth/email/reset-password-email-template";
import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
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
      throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND);
    }

    const token = await this.authService.generatePasswordResetToken();
    const resetPassword = ResetPasswordFactory.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });

    await this.withTransaction(async (tx) => {
      const resetPasswordRepository = this.resetPasswordRepository.withTx(tx);
      await resetPasswordRepository.deleteByUserId(user.id);
      await resetPasswordRepository.save(resetPassword);
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await this.emailService.send({
      to: user.email,
      subject: "Reset your password",
      react: ResetPasswordEmailTemplate({ resetUrl }),
    });
  }
}
