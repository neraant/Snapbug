import { ResetPasswordUseCase } from "@workspace/server/modules/auth/application/reset-password.use-case";
import { ResetPassword } from "@workspace/server/modules/auth/domain/reset-password.entity";
import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const token = "550e8400-e29b-41d4-a716-446655440000";

const input = {
  token,
  password: "password1",
};

const updatedUser = {
  id: userId,
  name: "Ada",
  email: "ada@example.com",
};

function createResetPassword(expiresAt: Date): ResetPassword {
  return new ResetPassword({
    id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
    userId,
    token,
    expiresAt,
  });
}

describe("ResetPasswordUseCase", () => {
  it("updates the password and clears reset tokens when the token is valid", async () => {
    const resetPassword = createResetPassword(new Date(Date.now() + 60_000));
    const resetPasswordRepository = {
      findByToken: vi.fn().mockResolvedValue(resetPassword),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const userPort = {
      update: vi.fn().mockResolvedValue(updatedUser),
    };
    const authService = { hashPassword: vi.fn().mockResolvedValue("hashed") };

    const useCase = new ResetPasswordUseCase(
      resetPasswordRepository as unknown as ResetPasswordRepository,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
    );

    const result = await useCase.execute(input);

    expect(resetPasswordRepository.findByToken).toHaveBeenCalledWith(input.token);
    expect(authService.hashPassword).toHaveBeenCalledWith(input.password);
    expect(userPort.update).toHaveBeenCalledWith({ userId, passwordHash: "hashed" });
    expect(resetPasswordRepository.delete).toHaveBeenCalledWith(resetPassword);
    expect(result).toEqual({ email: updatedUser.email });
  });

  it("throws when the reset token is unknown", async () => {
    const resetPasswordRepository = {
      findByToken: vi.fn().mockResolvedValue(null),
      delete: vi.fn(),
    };
    const userPort = { update: vi.fn() };
    const authService = { hashPassword: vi.fn() };

    const useCase = new ResetPasswordUseCase(
      resetPasswordRepository as unknown as ResetPasswordRepository,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_RESET_PASSWORD_TOKEN,
    });

    expect(authService.hashPassword).not.toHaveBeenCalled();
    expect(userPort.update).not.toHaveBeenCalled();
    expect(resetPasswordRepository.delete).not.toHaveBeenCalled();
  });

  it("throws when the reset token has expired", async () => {
    const resetPassword = createResetPassword(new Date(Date.now() - 1_000));
    const resetPasswordRepository = {
      findByToken: vi.fn().mockResolvedValue(resetPassword),
      delete: vi.fn(),
    };
    const userPort = { update: vi.fn() };
    const authService = { hashPassword: vi.fn() };

    const useCase = new ResetPasswordUseCase(
      resetPasswordRepository as unknown as ResetPasswordRepository,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_RESET_PASSWORD_TOKEN,
    });

    expect(authService.hashPassword).not.toHaveBeenCalled();
    expect(userPort.update).not.toHaveBeenCalled();
    expect(resetPasswordRepository.delete).not.toHaveBeenCalled();
  });
});
