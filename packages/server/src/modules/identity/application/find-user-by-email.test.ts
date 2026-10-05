import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { User } from "@workspace/server/modules/identity/entity/user.entity";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { describe, expect, it, vi } from "vitest";

const userId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const email = "alex@company.com";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const user = new User({
  id: userId,
  name: "Alex",
  email,
  passwordHash: "hashed-secret",
  passwordChangedAt: null,
  createdAt: persistedAt,
  updatedAt: persistedAt,
});

describe("FindUserByEmailUseCase", () => {
  it("returns a public dto when the user exists", async () => {
    const userRepository = { findByEmail: vi.fn().mockResolvedValue(user) };
    const useCase = new FindUserByEmailUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute(email);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(UserMapper.toDto(user));
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("returns null when the user is missing", async () => {
    const userRepository = { findByEmail: vi.fn().mockResolvedValue(null) };
    const useCase = new FindUserByEmailUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute(email);

    expect(result).toBeNull();
  });
});
