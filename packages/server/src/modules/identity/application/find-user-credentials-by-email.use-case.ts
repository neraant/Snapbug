import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";

export class FindUserCredentialsByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<ReturnType<typeof UserMapper.toCredentialsDto> | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? UserMapper.toCredentialsDto(user) : null;
  }
}
