import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { ChangePasswordUseCase } from "@workspace/server/modules/identity/application/change-password.use-case";
import { User } from "@workspace/server/modules/identity/entity/user.entity";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingUser = new User({
  id: userId,
  name: "Alex",
  email: "alex@company.com",
  passwordHash: "hashed-secret",
  interfaceLanguage: "en",
  passwordChangedAt: null,
  onboardingCompletedAt: null,
  termsAcceptedAt: null,
  createdAt: persistedAt,
  updatedAt: persistedAt,
});

describe("ChangePasswordUseCase", () => {
  it("verifies the current password, hashes the new one, and returns a public dto", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(existingUser),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const authService = {
      verifyPassword: vi.fn().mockResolvedValue(true),
      hashPassword: vi.fn().mockResolvedValue("new-hash"),
    };
    const useCase = new ChangePasswordUseCase(
      userRepository as unknown as UserRepository,
      authService as unknown as AuthService,
    );

    const result = await useCase.execute(userId, {
      currentPassword: "old-pass",
      newPassword: "new-pass-1",
      confirmPassword: "new-pass-1",
    });

    expect(authService.verifyPassword).toHaveBeenCalledWith("old-pass", "hashed-secret");
    expect(authService.hashPassword).toHaveBeenCalledWith("new-pass-1");
    expect(userRepository.save).toHaveBeenCalledOnce();
    const saved = userRepository.save.mock.calls[0]?.[0];
    expect(saved.passwordHash).toBe("new-hash");
    expect(result).toEqual(UserMapper.toDto(saved));
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("throws when the current password is wrong and does not hash or save", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(existingUser),
      save: vi.fn(),
    };
    const authService = {
      verifyPassword: vi.fn().mockResolvedValue(false),
      hashPassword: vi.fn(),
    };
    const useCase = new ChangePasswordUseCase(
      userRepository as unknown as UserRepository,
      authService as unknown as AuthService,
    );

    await expect(
      useCase.execute(userId, {
        currentPassword: "wrong",
        newPassword: "new-pass-1",
        confirmPassword: "new-pass-1",
      }),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_CURRENT_PASSWORD,
    });

    expect(authService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it("throws when the user is missing", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
    };
    const authService = {
      verifyPassword: vi.fn(),
      hashPassword: vi.fn(),
    };
    const useCase = new ChangePasswordUseCase(
      userRepository as unknown as UserRepository,
      authService as unknown as AuthService,
    );

    await expect(
      useCase.execute(userId, {
        currentPassword: "old",
        newPassword: "new-pass-1",
        confirmPassword: "new-pass-1",
      }),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });

    expect(authService.verifyPassword).not.toHaveBeenCalled();
  });
});
