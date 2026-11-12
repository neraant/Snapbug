import { CreateUserTokenUseCase } from "@workspace/server/modules/user-token/application/create-user-token.use-case";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

describe("CreateUserTokenUseCase", () => {
  it("returns the secret once and stores only its hash", async () => {
    const userTokenRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const useCase = new CreateUserTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
    );

    const result = await useCase.execute(userId);

    const saved = userTokenRepository.save.mock.calls[0]?.[0];
    expect(result.secret.startsWith("snb_ut_live_")).toBe(true);
    expect(result.prefix).toBe(result.secret.slice(0, "snb_ut_live_".length + 4));
    expect(result).not.toHaveProperty("tokenHash");
    expect(saved.userId).toBe(userId);
    expect(saved.tokenHash).toBe(createHash("sha256").update(result.secret).digest("hex"));
    expect(saved.tokenHash).not.toBe(result.secret);
    expect(saved.prefix).toBe(result.prefix);
    expect(saved.revokedAt).toBeNull();
    expect(result.id).toBe(saved.id);
    expect(result.createdAt).toBe(saved.createdAt.toISOString());
  });
});
