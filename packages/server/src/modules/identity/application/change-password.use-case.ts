import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { BadRequestError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { ChangePasswordInputDtoType } from "@workspace/validation/modules/user/dto/change-password.schema";
import type { ChangePasswordOutputDtoType } from "@workspace/validation/modules/user/dto/change-password.schema";

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(userId: string, input: ChangePasswordInputDtoType): Promise<ChangePasswordOutputDtoType> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND);
    }

    const isCurrentValid = await this.authService.verifyPassword(input.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestError(ERROR_CODES.INVALID_CURRENT_PASSWORD);
    }

    const passwordHash = await this.authService.hashPassword(input.newPassword);
    const updatedUser = user.update({ passwordHash });
    await this.userRepository.save(updatedUser);
    return UserMapper.toDto(updatedUser);
  }
}
