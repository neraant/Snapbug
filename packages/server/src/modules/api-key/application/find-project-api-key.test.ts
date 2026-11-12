import { FindProjectApiKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-api-key.use-case";
import { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import type { MembershipPort } from "@workspace/server/modules/api-key/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ApiKeyService } from "@workspace/server/modules/api-key/service/api-key.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const projectId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const apiKey = new ApiKey({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  projectId,
  key: "snapbug_test_key",
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
  revokedAt: null,
});
const project = { id: projectId, organizationId };

function setup(activeApiKey: ApiKey | null = apiKey) {
  const membershipPort = {
    filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
  };
  const projectPort = { findById: vi.fn().mockResolvedValue(project) };
  const apiKeyRepository = { findActiveByProjectId: vi.fn().mockResolvedValue(activeApiKey) };
  const saveWithAudit = vi.fn();
  const withActor = vi.fn().mockReturnValue({ saveWithAudit });
  const apiKeyService = { withTx: vi.fn().mockReturnValue({ withActor }) };
  const withTransaction = vi.fn(async (callback) => await callback({}));
  const useCase = new FindProjectApiKeyUseCase(
    membershipPort as unknown as MembershipPort,
    projectPort as unknown as ProjectPort,
    apiKeyRepository as unknown as ApiKeyRepository,
    apiKeyService as unknown as ApiKeyService,
    withTransaction as WithTransactionType,
  );
  return {
    apiKeyRepository,
    apiKeyService,
    membershipPort,
    projectPort,
    saveWithAudit,
    useCase,
    withActor,
    withTransaction,
  };
}

describe("FindProjectApiKeyUseCase", () => {
  it("returns the existing project key without creating another", async () => {
    const { useCase, apiKeyRepository, withTransaction } = setup();

    const result = await useCase.execute({ projectId }, userId, organizationId);

    expect(apiKeyRepository.findActiveByProjectId).toHaveBeenCalledWith(projectId);
    expect(withTransaction).not.toHaveBeenCalled();
    expect(result.key).not.toBe(apiKey.key);
    expect(result.revealed).toBe(false);
    expect(result.key.endsWith(apiKey.key.slice(-4))).toBe(true);
    expect(result.key).toBe(apiKey.key.replace(/.(?=.{4})/g, "\u2022"));
    expect(result.createdAt).toBe(apiKey.createdAt.toISOString());
  });

  it("creates and audits a key when the project has no active key", async () => {
    const { useCase, saveWithAudit, withActor } = setup(null);

    const result = await useCase.execute({ projectId }, userId, organizationId);

    const createdApiKey = saveWithAudit.mock.calls[0]?.[0] as ApiKey;

    expect(withActor).toHaveBeenCalledWith({ type: "user", id: userId });
    expect(saveWithAudit).toHaveBeenCalledWith(expect.any(ApiKey), "Create API key");
    expect(result.revealed).toBe(true);
    expect(result.key).toBe(createdApiKey.key);
    expect(result.createdAt).toBe(createdApiKey.createdAt.toISOString());
  });

  it("rejects a project outside the user's organization without creating a key", async () => {
    const { useCase, projectPort, apiKeyRepository, withTransaction } = setup();
    projectPort.findById.mockResolvedValue({ ...project, organizationId: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4" });

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(apiKeyRepository.findActiveByProjectId).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("rejects users without an organization before loading a project", async () => {
    const { useCase, membershipPort, projectPort, withTransaction } = setup();
    membershipPort.findByUserAndOrganization.mockResolvedValue(null);

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectPort.findById).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });
});
