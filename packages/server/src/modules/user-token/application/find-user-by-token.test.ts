import { FindUserByTokenUseCase } from "@workspace/server/modules/user-token/application/find-user-by-token.use-case";
import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import type { UserPort } from "@workspace/server/modules/user-token/port/user.port";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const secret = "snb_ut_live_abc123";
const createdAt = new Date("2026-11-12T10:00:00.000Z");

const user = {
  id: userId,
  name: "Ada",
  email: "ada@example.com",
  onboardingCompletedAt: createdAt,
};

const userToken = new UserToken({
  id: "8a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  tokenHash: createHash("sha256").update(secret).digest("hex"),
  prefix: "snb_ut_live_abc1",
  createdAt,
  revokedAt: null,
});

describe("FindUserByTokenUseCase", () => {
  it("returns the token owner", async () => {
    const userTokenRepository = { findByHash: vi.fn().mockResolvedValue(userToken) };
    const userPort = { findById: vi.fn().mockResolvedValue(user) };
    const useCase = new FindUserByTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({ token: secret });

    expect(userTokenRepository.findByHash).toHaveBeenCalledWith(userToken.tokenHash);
    expect(result).toEqual(user);
  });

  it("rejects a project key", async () => {
    const userTokenRepository = { findByHash: vi.fn() };
    const userPort = { findById: vi.fn() };
    const useCase = new FindUserByTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute({ token: "snb_pk_live_project" })).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_KEY_NOT_ACCEPTED,
    });

    expect(userTokenRepository.findByHash).not.toHaveBeenCalled();
    expect(userPort.findById).not.toHaveBeenCalled();
  });

  it("rejects a revoked token", async () => {
    const revoked = userToken.revoke(createdAt);
    const userTokenRepository = { findByHash: vi.fn().mockResolvedValue(revoked) };
    const userPort = { findById: vi.fn() };
    const useCase = new FindUserByTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute({ token: secret })).rejects.toMatchObject({
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });

    expect(userPort.findById).not.toHaveBeenCalled();
  });

  it("rejects an unknown token", async () => {
    const userTokenRepository = { findByHash: vi.fn().mockResolvedValue(null) };
    const userPort = { findById: vi.fn() };
    const useCase = new FindUserByTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute({ token: secret })).rejects.toMatchObject({
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });

    expect(userPort.findById).not.toHaveBeenCalled();
  });

  it("rejects a token whose owner is gone", async () => {
    const userTokenRepository = { findByHash: vi.fn().mockResolvedValue(userToken) };
    const userPort = { findById: vi.fn().mockRejectedValue(new NotFoundError(ERROR_CODES.USER_NOT_FOUND)) };
    const useCase = new FindUserByTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute({ token: secret })).rejects.toMatchObject({
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  });
});
