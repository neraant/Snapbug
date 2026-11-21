import { UpdateUserPreferenceUseCase } from "@workspace/server/modules/preference/application/update-user-preference.use-case";
import { UserPreference } from "@workspace/server/modules/preference/entity/user-preference.entity";
import { UserPreferenceMapper } from "@workspace/server/modules/preference/entity/user-preference.mapper";
import type { UserPreferenceRepository } from "@workspace/server/modules/preference/repository/user-preference.repository";
import { userPreferenceDefaults } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { describe, expect, it, vi } from "vitest";

const userId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingPreference = new UserPreference({
  userId,
  timeZone: userPreferenceDefaults.timeZone,
  theme: userPreferenceDefaults.theme,
  createdAt: persistedAt,
  updatedAt: persistedAt,
});

describe("UpdateUserPreferenceUseCase", () => {
  it("patches an existing preference and returns a public dto", async () => {
    const userPreferenceRepository = {
      findByUserId: vi.fn().mockResolvedValue(existingPreference),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateUserPreferenceUseCase(userPreferenceRepository as unknown as UserPreferenceRepository);

    const result = await useCase.execute(userId, { theme: "dark" });

    expect(userPreferenceRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(userPreferenceRepository.save).toHaveBeenCalledOnce();
    const saved = userPreferenceRepository.save.mock.calls[0]?.[0];
    expect(saved.theme).toBe("dark");
    expect(result).toEqual(UserPreferenceMapper.toDto(saved));
    expect(result.theme).toBe("dark");
  });

  it("creates defaults when no preference exists, then applies the patch", async () => {
    const userPreferenceRepository = {
      findByUserId: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateUserPreferenceUseCase(userPreferenceRepository as unknown as UserPreferenceRepository);

    const result = await useCase.execute(userId, { timeZone: "America/New_York" });

    expect(userPreferenceRepository.save).toHaveBeenCalledOnce();
    const saved = userPreferenceRepository.save.mock.calls[0]?.[0];
    expect(saved.userId).toBe(userId);
    expect(saved.timeZone).toBe("America/New_York");
    expect(result.timeZone).toBe("America/New_York");
  });
});