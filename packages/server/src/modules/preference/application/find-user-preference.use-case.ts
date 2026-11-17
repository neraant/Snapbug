import { UserPreferenceFactory } from "@workspace/server/modules/preference/entity/user-preference.factory";
import { UserPreferenceMapper } from "@workspace/server/modules/preference/entity/user-preference.mapper";
import type { UserPreferenceRepository } from "@workspace/server/modules/preference/repository/user-preference.repository";
import type { FindUserPreferenceOutputDtoType } from "@workspace/validation/modules/preference/dto/find-user-preference.schema";

export class FindUserPreferenceUseCase {
  constructor(private readonly userPreferenceRepository: UserPreferenceRepository) {}

  async execute(userId: string): Promise<FindUserPreferenceOutputDtoType> {
    let userPreference = await this.userPreferenceRepository.findByUserId(userId);
    if (!userPreference) {
      userPreference = UserPreferenceFactory.create(userId);
      await this.userPreferenceRepository.save(userPreference);
    }

    return UserPreferenceMapper.toDto(userPreference);
  }
}