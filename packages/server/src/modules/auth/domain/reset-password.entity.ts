import type { ResetPasswordPersistedType } from "@workspace/server/modules/auth/domain/reset-password.types";

export class ResetPassword {
  readonly id: ResetPasswordPersistedType["id"];
  readonly userId: ResetPasswordPersistedType["userId"];
  readonly token: ResetPasswordPersistedType["token"];
  readonly expiresAt: ResetPasswordPersistedType["expiresAt"];

  constructor(resetPassword: ResetPasswordPersistedType) {
    this.id = resetPassword.id;
    this.userId = resetPassword.userId;
    this.token = resetPassword.token;
    this.expiresAt = resetPassword.expiresAt;
  }

  isValid(at: Date = new Date()): boolean {
    return this.expiresAt.getTime() > at.getTime();
  }

  toObject(): ResetPasswordPersistedType {
    return {
      id: this.id,
      userId: this.userId,
      token: this.token,
      expiresAt: this.expiresAt,
    };
  }
}
