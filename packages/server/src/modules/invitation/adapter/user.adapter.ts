import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class UserAdapter implements UserPort {
  private readonly findUserByEmailUseCase: FindUserByEmailUseCase;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
  }

  async findByEmail(email: string): Promise<UserModelType | null> {
    return await this.findUserByEmailUseCase.execute(email);
  }
}
