import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateInterfaceLanguageInputDtoType } from "@workspace/validation/modules/user/dto/update-interface-language.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class UpdateInterfaceLanguageUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, input: UpdateInterfaceLanguageInputDtoType): Promise<UserModelType> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND);
    }

    const updatedUser = user.update({ interfaceLanguage: input.interfaceLanguage });
    await this.userRepository.save(updatedUser);
    return UserMapper.toDto(updatedUser);
  }
}
