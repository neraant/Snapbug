import { ResetPassword } from "@workspace/server/modules/auth/domain/reset-password.entity";
import type { ResetPasswordPersistedType } from "@workspace/server/modules/auth/domain/reset-password.types";
import type { ResetPasswordOutputDtoType } from "@workspace/validation/modules/auth/dto/reset-password.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export abstract class ResetPasswordMapper {
  static fromPersistence(row: ResetPasswordPersistedType): ResetPassword {
    return new ResetPassword(row);
  }

  static toPersistence(resetPassword: ResetPassword): ResetPasswordPersistedType {
    return resetPassword.toObject();
  }

  static toResetPasswordOutput(user: UserModelType): ResetPasswordOutputDtoType {
    return { email: user.email };
  }

  static toVerifyCredentialsOutput(credentials: UserModelType & { passwordHash: string }): UserModelType {
    const { id, email, name, onboardingCompletedAt } = credentials;
    return { id, email, name, onboardingCompletedAt };
  }
}
