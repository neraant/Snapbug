import { FindUsersByIdsUseCase } from "@workspace/server/modules/identity/application/find-users-by-ids.use-case";
import { User } from "@workspace/server/modules/identity/entity/user.entity";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
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

describe("FindUsersByIdsUseCase", () => {
  it("returns public user dtos", async () => {
    const userRepository = { findManyByIds: vi.fn().mockResolvedValue([user]) };
    const useCase = new FindUsersByIdsUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute([userId]);

    expect(userRepository.findManyByIds).toHaveBeenCalledWith([userId]);
    expect(result).toEqual([UserMapper.toDto(user)]);
    expect(result[0]).not.toHaveProperty("passwordHash");
  });

  it("returns an empty list without querying when no ids are given", async () => {
    const userRepository = { findManyByIds: vi.fn() };
    const useCase = new FindUsersByIdsUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute([]);

    expect(result).toEqual([]);
    expect(userRepository.findManyByIds).not.toHaveBeenCalled();
  });
});
