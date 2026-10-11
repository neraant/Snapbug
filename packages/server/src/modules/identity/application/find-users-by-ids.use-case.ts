import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class FindUsersByIdsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(ids: string[]): Promise<UserModelType[]> {
    if (ids.length === 0) return [];

    const users = await this.userRepository.findManyByIds(ids);
    return users.map((user) => UserMapper.toDto(user));
  }
}
