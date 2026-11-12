import type { DbClient } from "@workspace/database";
import type {
  CreateUserData,
  UserCredentials,
  UserPort as AuthUserPort,
} from "@workspace/server/modules/auth/port/user.port";
import { CreateUserUseCase } from "@workspace/server/modules/identity/application/create-user.use-case";
import { FindUserUseCase } from "@workspace/server/modules/identity/application/find-user.use-case";
import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { FindUserCredentialsByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-credentials-by-email.use-case";
import { FindUsersByIdsUseCase } from "@workspace/server/modules/identity/application/find-users-by-ids.use-case";
import { UpdateUserUseCase } from "@workspace/server/modules/identity/application/update-user.use-case";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type {
  FindUserOnboardingStateOutput,
  UserPort as OrganizationUserPort,
} from "@workspace/server/modules/organization/port/user.port";
import { suggestedOrganizationName } from "@workspace/server/modules/organization/suggested-organization-name.util";
import type { UpdateUserInputDtoType } from "@workspace/validation/modules/user/dto/update-user.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class UserAdapter implements AuthUserPort, OrganizationUserPort {
  private readonly createUser: CreateUserUseCase;
  private readonly findUserByEmail: FindUserByEmailUseCase;
  private readonly findUserCredentialsByEmail: FindUserCredentialsByEmailUseCase;
  private readonly findUser: FindUserUseCase;
  private readonly findUsersByIds: FindUsersByIdsUseCase;
  private readonly updateUser: UpdateUserUseCase;

  constructor(private readonly userRepository: UserRepository) {
    this.createUser = new CreateUserUseCase(userRepository);
    this.findUserByEmail = new FindUserByEmailUseCase(userRepository);
    this.findUserCredentialsByEmail = new FindUserCredentialsByEmailUseCase(userRepository);
    this.findUser = new FindUserUseCase(userRepository);
    this.findUsersByIds = new FindUsersByIdsUseCase(userRepository);
    this.updateUser = new UpdateUserUseCase(userRepository);
  }

  withTx(tx: unknown): UserAdapter {
    return new UserAdapter(this.userRepository.withTx(tx as DbClient));
  }

  async create(data: CreateUserData): Promise<UserModelType> {
    return await this.createUser.execute(data);
  }

  async findById(userId: string): Promise<UserModelType> {
    return await this.findUser.execute(userId);
  }

  async findByEmail(email: string): Promise<UserModelType | null> {
    return await this.findUserByEmail.execute(email);
  }

  async findManyByIds(ids: string[]): Promise<UserModelType[]> {
    return await this.findUsersByIds.execute(ids);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    return await this.findUserCredentialsByEmail.execute(email);
  }

  async update(input: UpdateUserInputDtoType): Promise<UserModelType> {
    return await this.updateUser.execute(input);
  }

  async findOnboardingState(userId: string): Promise<FindUserOnboardingStateOutput> {
    const user = await this.findUser.execute(userId);
    return {
      onboardingCompletedAt: user.onboardingCompletedAt,
      suggestedOrganizationName: suggestedOrganizationName(user),
    };
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    await this.updateUser.execute({ userId, onboardingCompletedAt: new Date() });
  }
}
