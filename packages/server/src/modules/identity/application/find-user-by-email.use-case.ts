import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserModelType | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? UserMapper.toDto(user) : null;
  }
}
