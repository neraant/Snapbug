import { RevokeUserTokenUseCase } from "@workspace/server/modules/user-token/application/revoke-user-token.use-case";
import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const otherUserId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-11-12T10:00:00.000Z");

function createUserToken(ownerId: string, revokedAt: Date | null = null) {
  return new UserToken({
    id: "8a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
    userId: ownerId,
    tokenHash: "hashed-secret",
    prefix: "snb_ut_live_ab12",
    createdAt,
    revokedAt,
  });
}

describe("RevokeUserTokenUseCase", () => {
  it("revokes the member's token", async () => {
    const userToken = createUserToken(userId);
    const userTokenRepository = {
      findById: vi.fn().mockResolvedValue(userToken),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new RevokeUserTokenUseCase(userTokenRepository as unknown as UserTokenRepository);

    const result = await useCase.execute({ id: userToken.id }, userId);

    expect(result.revokedAt).not.toBeNull();
    expect(result).not.toHaveProperty("secret");
    expect(result).not.toHaveProperty("tokenHash");
    expect(userTokenRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: userToken.id, revokedAt: expect.any(Date) }),
    );
  });

  it("does not revoke someone else's token", async () => {
    const userToken = createUserToken(otherUserId);
    const userTokenRepository = {
      findById: vi.fn().mockResolvedValue(userToken),
      save: vi.fn(),
    };
    const useCase = new RevokeUserTokenUseCase(userTokenRepository as unknown as UserTokenRepository);

    await expect(useCase.execute({ id: userToken.id }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_TOKEN_NOT_FOUND,
    });

    expect(userTokenRepository.save).not.toHaveBeenCalled();
  });

  it("does not save again when the token is already revoked", async () => {
    const userToken = createUserToken(userId, createdAt);
    const userTokenRepository = {
      findById: vi.fn().mockResolvedValue(userToken),
      save: vi.fn(),
    };
    const useCase = new RevokeUserTokenUseCase(userTokenRepository as unknown as UserTokenRepository);

    const result = await useCase.execute({ id: userToken.id }, userId);

    expect(result.revokedAt).toBe(createdAt.toISOString());
    expect(userTokenRepository.save).not.toHaveBeenCalled();
  });
});
