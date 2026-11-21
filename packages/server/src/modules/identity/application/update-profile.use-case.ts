import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateProfileInputDtoType } from "@workspace/validation/modules/user/dto/update-profile.schema";
import type { UpdateProfileOutputDtoType } from "@workspace/validation/modules/user/dto/update-profile.schema";

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, input: UpdateProfileInputDtoType): Promise<UpdateProfileOutputDtoType> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND);
    }

    const updatedUser = user.update({ name: input.name });
    await this.userRepository.save(updatedUser);
    return UserMapper.toDto(updatedUser);
  }
}
