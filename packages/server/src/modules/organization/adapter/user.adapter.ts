import { FindUserUseCase } from "@workspace/server/modules/identity/application/find-user.use-case";
import { UpdateUserUseCase } from "@workspace/server/modules/identity/application/update-user.use-case";
import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { FindUserOnboardingStateOutput, UserPort } from "@workspace/server/modules/organization/port/user.port";

const FALLBACK_ORGANIZATION_NAME = "Workspace";

export function suggestedOrganizationName(user: { name?: string | null; email?: string | null }): string {
  const name = user.name?.trim();
  if (name) return name;

  const localPart = user.email?.split("@")[0]?.trim();
  if (localPart) return localPart;

  return FALLBACK_ORGANIZATION_NAME;
}

export class UserAdapter implements UserPort {
  private readonly findUserUseCase: FindUserUseCase;
  private readonly updateUserUseCase: UpdateUserUseCase;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.findUserUseCase = new FindUserUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
  }

  async findOnboardingState(userId: string): Promise<FindUserOnboardingStateOutput> {
    const user = await this.findUserUseCase.execute(userId);
    return {
      onboardingCompletedAt: user.onboardingCompletedAt,
      suggestedOrganizationName: suggestedOrganizationName(user),
    };
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    await this.updateUserUseCase.execute({ userId, onboardingCompletedAt: new Date() });
  }
}
