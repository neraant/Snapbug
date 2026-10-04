import { ResetPassword } from "@workspace/server/modules/auth/domain/reset-password.entity";
import type { CreateResetPasswordType } from "@workspace/server/modules/auth/domain/reset-password.types";

export abstract class ResetPasswordFactory {
  static create(createResetPassword: CreateResetPasswordType): ResetPassword {
    return new ResetPassword({
      id: crypto.randomUUID(),
      ...createResetPassword,
    });
  }
}
