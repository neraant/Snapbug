import { FindUserUseCase } from "@workspace/server/modules/identity/application/find-user.use-case";
import { User } from "@workspace/server/modules/identity/entity/user.entity";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const user = new User({
  id: userId,
  name: "Alex",
  email: "alex@company.com",
  passwordHash: "hashed-secret",
  interfaceLanguage: "en",
  passwordChangedAt: null,
  onboardingCompletedAt: null,
  createdAt: persistedAt,
  updatedAt: persistedAt,
});

describe("FindUserUseCase", () => {
  it("returns a public dto when the user exists", async () => {
    const userRepository = { findById: vi.fn().mockResolvedValue(user) };
    const useCase = new FindUserUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(UserMapper.toDto(user));
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("throws when the user is missing", async () => {
    const userRepository = { findById: vi.fn().mockResolvedValue(null) };
    const useCase = new FindUserUseCase(userRepository as unknown as UserRepository);

    await expect(useCase.execute(userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });
  });
});
