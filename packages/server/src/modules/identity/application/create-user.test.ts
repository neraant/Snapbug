import { CreateUserUseCase } from "@workspace/server/modules/identity/application/create-user.use-case";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { describe, expect, it, vi } from "vitest";

const input = {
  email: "alex@company.com",
  name: "Alex",
  passwordHash: "hashed-secret",
};

describe("CreateUserUseCase", () => {
  it("creates a user and returns a public dto", async () => {
    const userRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const useCase = new CreateUserUseCase(userRepository as unknown as UserRepository);

    const result = await useCase.execute(input);

    expect(userRepository.save).toHaveBeenCalledOnce();
    const saved = userRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(UserMapper.toDto(saved));
    expect(saved.email).toBe(input.email);
    expect(saved.name).toBe(input.name);
    expect(result).not.toHaveProperty("passwordHash");
  });
});
