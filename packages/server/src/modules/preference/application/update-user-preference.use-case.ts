import { UserPreferenceFactory } from "@workspace/server/modules/preference/entity/user-preference.factory";
import { UserPreferenceMapper } from "@workspace/server/modules/preference/entity/user-preference.mapper";
import type { UserPreferenceRepository } from "@workspace/server/modules/preference/repository/user-preference.repository";
import type { UpdateUserPreferenceInputDtoType } from "@workspace/validation/modules/preference/dto/update-user-preference.schema";
import type { UpdateUserPreferenceOutputDtoType } from "@workspace/validation/modules/preference/dto/update-user-preference.schema";

export class UpdateUserPreferenceUseCase {
  constructor(private readonly userPreferenceRepository: UserPreferenceRepository) {}

  async execute(userId: string, input: UpdateUserPreferenceInputDtoType): Promise<UpdateUserPreferenceOutputDtoType> {
    let userPreference = await this.userPreferenceRepository.findByUserId(userId);
    if (!userPreference) {
      userPreference = UserPreferenceFactory.create(userId);
    }

    const updatedUserPreference = userPreference.update({
      ...(input.timeZone !== undefined && { timeZone: input.timeZone }),
      ...(input.theme !== undefined && { theme: input.theme }),
    });
    await this.userPreferenceRepository.save(updatedUserPreference);
    return UserPreferenceMapper.toDto(updatedUserPreference);
  }
}
