import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { BadRequestError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  ResetPasswordInputDtoType,
  ResetPasswordOutputDtoType,
} from "@workspace/validation/modules/auth/dto/reset-password.schema";

export class ResetPasswordUseCase {
  constructor(
    private readonly resetPasswordRepository: ResetPasswordRepository,
    private readonly userPort: UserPort,
    private readonly authService: AuthService,
  ) {}

  async execute(input: ResetPasswordInputDtoType): Promise<ResetPasswordOutputDtoType> {
    const resetPassword = await this.resetPasswordRepository.findByToken(input.token);
    if (!resetPassword?.isValid()) {
      throw new BadRequestError(ERROR_CODES.INVALID_RESET_PASSWORD_TOKEN);
    }

    const passwordHash = await this.authService.hashPassword(input.password);
    const user = await this.userPort.update({ userId: resetPassword.userId, passwordHash });
    await this.resetPasswordRepository.deleteByUserId(resetPassword.userId);
    return { email: user.email };
  }
}
