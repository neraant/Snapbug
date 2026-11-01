import { RequestPasswordResetUseCase } from "@workspace/server/modules/auth/application/request-password-reset.use-case";
import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const input = { email: "ada@example.com" };

const user = {
  id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  name: "Ada",
  email: "ada@example.com",
};

describe("RequestPasswordResetUseCase", () => {
  it("stores a reset token and sends email when the user exists", async () => {
    const token = "550e8400-e29b-41d4-a716-446655440000";
    const txRepo = {
      findByUserId: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const resetPasswordRepository = {
      withTx: vi.fn().mockReturnValue(txRepo),
    };
    const userPort = { findByEmail: vi.fn().mockResolvedValue(user) };
    const authService = { generatePasswordResetToken: vi.fn().mockResolvedValue(token) };
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const withTransaction = vi.fn(async (callback) => await callback({}));

    const useCase = new RequestPasswordResetUseCase(
      resetPasswordRepository as unknown as ResetPasswordRepository,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
      emailService as unknown as EmailService,
      withTransaction as WithTransactionType,
    );

    await useCase.execute(input);

    expect(userPort.findByEmail).toHaveBeenCalledWith(input.email);
    expect(authService.generatePasswordResetToken).toHaveBeenCalledOnce();
    expect(withTransaction).toHaveBeenCalledOnce();
    expect(resetPasswordRepository.withTx).toHaveBeenCalledOnce();
    expect(txRepo.findByUserId).toHaveBeenCalledWith(user.id);
    expect(txRepo.delete).not.toHaveBeenCalled();
    expect(txRepo.save).toHaveBeenCalledOnce();
    const saved = txRepo.save.mock.calls[0]?.[0];
    expect(saved?.userId).toBe(user.id);
    expect(saved?.token).toBe(token);
    expect(emailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        subject: "Reset your password",
      }),
    );
  });

  it("throws when no user exists for the email", async () => {
    const resetPasswordRepository = { withTx: vi.fn() };
    const userPort = { findByEmail: vi.fn().mockResolvedValue(null) };
    const authService = { generatePasswordResetToken: vi.fn() };
    const emailService = { send: vi.fn() };
    const withTransaction = vi.fn();

    const useCase = new RequestPasswordResetUseCase(
      resetPasswordRepository as unknown as ResetPasswordRepository,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
      emailService as unknown as EmailService,
      withTransaction as WithTransactionType,
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_NOT_FOUND,
    });

    expect(authService.generatePasswordResetToken).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
    expect(emailService.send).not.toHaveBeenCalled();
  });
});
