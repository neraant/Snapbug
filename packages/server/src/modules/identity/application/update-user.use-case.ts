import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateUserInputDtoType } from "@workspace/validation/modules/user/dto/update-user.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInputDtoType): Promise<UserModelType> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND);
    }

    const updatedUser = user.update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.passwordHash !== undefined && {
        passwordHash: input.passwordHash,
        passwordChangedAt: new Date(),
      }),
      ...(input.onboardingCompletedAt !== undefined && {
        onboardingCompletedAt: user.onboardingCompletedAt ?? input.onboardingCompletedAt,
      }),
    });
    await this.userRepository.save(updatedUser);
    return UserMapper.toDto(updatedUser);
  }
}
