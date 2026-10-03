import { UserFactory } from "@workspace/server/modules/identity/entity/user.factory";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { CreateUserWithPasswordHashDtoType } from "@workspace/validation/modules/user/dto/create-user.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async execute(input: CreateUserWithPasswordHashDtoType): Promise<UserModelType> {
    const user = UserFactory.create({
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
    });
    await this.userRepository.save(user);
    return UserMapper.toDto(user);
  }
}
