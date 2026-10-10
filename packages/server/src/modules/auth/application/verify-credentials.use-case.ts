import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import type { VerifyCredentialsInputDtoType } from "@workspace/validation/modules/auth/dto/verify-credentials.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class VerifyCredentialsUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly userPort: UserPort,
  ) {}

  async execute(input: VerifyCredentialsInputDtoType): Promise<UserModelType | null> {
    const stored = await this.userPort.findCredentialsByEmail(input.email);
    if (!stored) return null;

    const isValid = await this.authService.verifyPassword(input.password, stored.passwordHash);
    if (!isValid) return null;

    return {
      id: stored.id,
      email: stored.email,
      name: stored.name,
      onboardingCompletedAt: stored.onboardingCompletedAt,
    };
  }
}
