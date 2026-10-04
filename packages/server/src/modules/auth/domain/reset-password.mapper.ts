import { ResetPassword } from "@workspace/server/modules/auth/domain/reset-password.entity";
import type { ResetPasswordPersistedType } from "@workspace/server/modules/auth/domain/reset-password.types";

export abstract class ResetPasswordMapper {
  static fromPersistence(row: ResetPasswordPersistedType): ResetPassword {
    return new ResetPassword(row);
  }

  static toPersistence(resetPassword: ResetPassword): ResetPasswordPersistedType {
    return resetPassword.toObject();
  }
}
