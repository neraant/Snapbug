import { UpdateProfileUseCase } from "@workspace/server/modules/identity/application/update-profile.use-case";
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

describe("UpdateProfileUseCase", () => {
  it("saves the display name and returns a public dto", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(existingUser),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateProfileUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute(userId, { name: "Alex Chen" });

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.save).toHaveBeenCalledOnce();
    const saved = userRepository.save.mock.calls[0]?.[0];
    expect(saved.name).toBe("Alex Chen");
    expect(result).toEqual(UserMapper.toDto(saved));
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("throws when the user is missing and does not save", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
    };
    const useCase = new UpdateProfileUseCase(userRepository as unknown as UserRepository);

    await expect(useCase.execute(userId, { name: "Alex Chen" })).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
