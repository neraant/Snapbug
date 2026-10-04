import type { CreateUserData, UserCredentials, UserPort } from "@workspace/server/modules/auth/port/user.port";
import { CreateUserUseCase } from "@workspace/server/modules/identity/application/create-user.use-case";
import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { FindUserCredentialsByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-credentials-by-email.use-case";
import { UpdateUserUseCase } from "@workspace/server/modules/identity/application/update-user.use-case";
import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { UpdateUserInputDtoType } from "@workspace/validation/modules/user/dto/update-user.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class UserAdapter implements UserPort {
  private readonly createUserUseCase: CreateUserUseCase;
  private readonly findUserByEmailUseCase: FindUserByEmailUseCase;
  private readonly findUserCredentialsByEmailUseCase: FindUserCredentialsByEmailUseCase;
  private readonly updateUserUseCase: UpdateUserUseCase;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
    this.findUserCredentialsByEmailUseCase = new FindUserCredentialsByEmailUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
  }

  async create(data: CreateUserData): Promise<UserModelType> {
    return await this.createUserUseCase.execute(data);
  }

  async findByEmail(email: string): Promise<UserModelType | null> {
    return await this.findUserByEmailUseCase.execute(email);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    return await this.findUserCredentialsByEmailUseCase.execute(email);
  }

  async update(input: UpdateUserInputDtoType): Promise<UserModelType> {
    return await this.updateUserUseCase.execute(input);
  }
}
