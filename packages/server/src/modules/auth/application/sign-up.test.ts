import { SignUpUseCase } from "@workspace/server/modules/auth/application/sign-up.use-case";
import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const input = {
  email: "ada@example.com",
  name: "Ada",
  password: "password1",
  acceptedTerms: true as const,
};

const publicUser = {
  id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  name: "Ada",
  email: "ada@example.com",
};

describe("SignUpUseCase", () => {
  it("creates a user when email is available", async () => {
    const authService = { hashPassword: vi.fn().mockResolvedValue("hashed") };
    const userPort = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(publicUser),
    };
    const useCase = new SignUpUseCase(authService as unknown as AuthService, userPort as unknown as UserPort);

    const result = await useCase.execute(input);

    expect(userPort.findByEmail).toHaveBeenCalledWith(input.email);
    expect(authService.hashPassword).toHaveBeenCalledWith(input.password);
    expect(userPort.create).toHaveBeenCalledWith({
      email: input.email,
      name: input.name,
      passwordHash: "hashed",
      termsAcceptedAt: expect.any(Date),
    });
    expect(result).toEqual(publicUser);
    expect(result).not.toHaveProperty("password");
  });

  it("throws when the terms are not accepted", async () => {
    const authService = { hashPassword: vi.fn() };
    const userPort = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    const useCase = new SignUpUseCase(authService as unknown as AuthService, userPort as unknown as UserPort);

    await expect(useCase.execute({ ...input, acceptedTerms: false as unknown as true })).rejects.toMatchObject({
      errorCode: ERROR_CODES.TERMS_NOT_ACCEPTED,
    });

    expect(userPort.findByEmail).not.toHaveBeenCalled();
    expect(authService.hashPassword).not.toHaveBeenCalled();
    expect(userPort.create).not.toHaveBeenCalled();
  });

  it("throws when email is taken", async () => {
    const authService = { hashPassword: vi.fn() };
    const userPort = {
      findByEmail: vi.fn().mockResolvedValue(publicUser),
      create: vi.fn(),
    };
    const useCase = new SignUpUseCase(authService as unknown as AuthService, userPort as unknown as UserPort);

    await expect(useCase.execute(input)).rejects.toMatchObject({
      errorCode: ERROR_CODES.EMAIL_ALREADY_TAKEN,
    });

    expect(authService.hashPassword).not.toHaveBeenCalled();
    expect(userPort.create).not.toHaveBeenCalled();
  });
});
