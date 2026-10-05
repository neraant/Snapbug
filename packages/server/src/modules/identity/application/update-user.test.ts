import { UpdateUserUseCase } from "@workspace/server/modules/identity/application/update-user.use-case";
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
  passwordChangedAt: null,
  createdAt: persistedAt,
  updatedAt: persistedAt,
});

describe("UpdateUserUseCase", () => {
  it("updates the user and returns a public dto", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(existingUser),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateUserUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute({ userId, name: "Alex Chen" });

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.save).toHaveBeenCalledOnce();
    const saved = userRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(UserMapper.toDto(saved));
    expect(saved.name).toBe("Alex Chen");
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("sets passwordChangedAt when the password hash changes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-05T12:00:00.000Z"));
    const userRepository = {
      findById: vi.fn().mockResolvedValue(existingUser),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateUserUseCase(userRepository as unknown as UserRepository);

    await useCase.execute({ userId, passwordHash: "new-hash" });

    const saved = userRepository.save.mock.calls[0]?.[0];
    expect(saved.passwordHash).toBe("new-hash");
    expect(saved.passwordChangedAt).toEqual(new Date("2026-10-05T12:00:00.000Z"));
    vi.useRealTimers();
  });

  it("throws when the user is missing", async () => {
    const userRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
    };
    const useCase = new UpdateUserUseCase(userRepository as unknown as UserRepository);

    await expect(useCase.execute({ userId, name: "Alex Chen" })).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
