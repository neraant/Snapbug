import { FindUserTokensUseCase } from "@workspace/server/modules/user-token/application/find-user-tokens.use-case";
import { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-11-12T10:00:00.000Z");

const userToken = new UserToken({
  id: "8a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  tokenHash: "hashed-secret",
  prefix: "snb_ut_live_ab12",
  createdAt,
  revokedAt: null,
});

describe("FindUserTokensUseCase", () => {
  it("lists the member's tokens without the secret", async () => {
    const userTokenRepository = { findManyByUserId: vi.fn().mockResolvedValue([userToken]) };
    const useCase = new FindUserTokensUseCase(userTokenRepository as unknown as UserTokenRepository);

    const result = await useCase.execute(userId);

    expect(userTokenRepository.findManyByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual([
      {
        id: userToken.id,
        prefix: userToken.prefix,
        createdAt: createdAt.toISOString(),
        revokedAt: null,
      },
    ]);
    expect(result[0]).not.toHaveProperty("secret");
    expect(result[0]).not.toHaveProperty("tokenHash");
  });
});
