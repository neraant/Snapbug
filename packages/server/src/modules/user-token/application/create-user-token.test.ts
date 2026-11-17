import { CreateUserTokenUseCase } from "@workspace/server/modules/user-token/application/create-user-token.use-case";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { MCP_READ_SCOPES } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d3";
const projectId = "5a8c69a1-1ab1-45a8-8497-eae1e506d9d2";

const membership = {
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.USER,
};

describe("CreateUserTokenUseCase", () => {
  it("returns the secret once and stores scoped metadata", async () => {
    const userTokenRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([{ id: projectId, organizationId }]),
    };
    const useCase = new CreateUserTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      membershipPort,
      projectPort,
    );

    const result = await useCase.execute({ name: "Cursor MCP", preset: "readOnly" }, userId);

    const saved = userTokenRepository.save.mock.calls[0]?.[0];
    expect(result.secret.startsWith("snb_ut_live_")).toBe(true);
    expect(result.scopePreset).toBe("readOnly");
    expect(saved.scopes).toEqual(expect.arrayContaining(MCP_READ_SCOPES.filter((scope) => scope !== "activity:read")));
    expect(saved.scopes).not.toContain("tickets:write");
    expect(saved.tokenHash).toBe(createHash("sha256").update(result.secret).digest("hex"));
    expect(saved.projectIds).toBeNull();
  });

  it("stores project restrictions on the token", async () => {
    const userTokenRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([{ id: projectId, organizationId }]),
    };
    const useCase = new CreateUserTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      membershipPort,
      projectPort,
    );

    await useCase.execute({ name: "Scoped", preset: "readOnly", projectIds: [projectId] }, userId);

    const saved = userTokenRepository.save.mock.calls[0]?.[0];
    expect(saved.projectIds).toEqual([projectId]);
  });

  it("allows members to create a full access preset without activity scope", async () => {
    const userTokenRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([]),
    };
    const useCase = new CreateUserTokenUseCase(
      new UserTokenService(),
      userTokenRepository as unknown as UserTokenRepository,
      membershipPort,
      projectPort,
    );

    await useCase.execute({ name: "Full", preset: "fullAccess" }, userId);

    const saved = userTokenRepository.save.mock.calls[0]?.[0];
    expect(saved.scopePreset).toBe("fullAccess");
    expect(saved.scopes).not.toContain("activity:read");
    expect(saved.scopes).toContain("tickets:write");
    expect(saved.scopes).toContain("comments:write");
  });
});
