import { VerifyCredentialsUseCase } from "@workspace/server/modules/auth/application/verify-credentials.use-case";
import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { describe, expect, it, vi } from "vitest";

const input = { email: "ada@example.com", password: "password1" };

const stored = {
  id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  name: "Ada",
  email: "ada@example.com",
  passwordHash: "hashed",
};

describe("VerifyCredentialsUseCase", () => {
  it("returns the public user when the password matches", async () => {
    const authService = { verifyPassword: vi.fn().mockResolvedValue(true) };
    const userPort = {
      findCredentialsByEmail: vi.fn().mockResolvedValue(stored),
    };
    const useCase = new VerifyCredentialsUseCase(
      authService as unknown as AuthService,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute(input);

    expect(userPort.findCredentialsByEmail).toHaveBeenCalledWith(input.email);
    expect(authService.verifyPassword).toHaveBeenCalledWith(input.password, stored.passwordHash);
    expect(result).toEqual({ id: stored.id, email: stored.email, name: stored.name });
    expect(result).not.toHaveProperty("password");
  });

  it("returns null when no user exists for the email", async () => {
    const authService = { verifyPassword: vi.fn() };
    const userPort = {
      findCredentialsByEmail: vi.fn().mockResolvedValue(null),
    };
    const useCase = new VerifyCredentialsUseCase(
      authService as unknown as AuthService,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute(input);

    expect(result).toBeNull();
    expect(authService.verifyPassword).not.toHaveBeenCalled();
  });

  it("returns null when the password does not match", async () => {
    const authService = { verifyPassword: vi.fn().mockResolvedValue(false) };
    const userPort = {
      findCredentialsByEmail: vi.fn().mockResolvedValue(stored),
    };
    const useCase = new VerifyCredentialsUseCase(
      authService as unknown as AuthService,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute(input);

    expect(result).toBeNull();
    expect(authService.verifyPassword).toHaveBeenCalledWith(input.password, stored.passwordHash);
  });
});
