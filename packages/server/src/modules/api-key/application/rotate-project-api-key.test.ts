import { RotateProjectApiKeyUseCase } from "@workspace/server/modules/api-key/application/rotate-project-api-key.use-case";
import { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import type { MembershipPort } from "@workspace/server/modules/api-key/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ApiKeyService } from "@workspace/server/modules/api-key/service/api-key.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
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
const adminMembership = { organizationId, role: UserRole.ADMIN, id: "membership" };

function setup(activeApiKey: ApiKey | null = apiKey) {
  const membershipPort = {
    filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    findByUserAndOrganization: vi.fn().mockResolvedValue(adminMembership),
  };
  const projectPort = { findById: vi.fn().mockResolvedValue(project) };
  const apiKeyRepository = { findActiveByProjectId: vi.fn().mockResolvedValue(activeApiKey) };
  const replaceWithAudit = vi.fn();
  const withActor = vi.fn().mockReturnValue({ replaceWithAudit });
  const apiKeyService = { withTx: vi.fn().mockReturnValue({ withActor }) };
  const withTransaction = vi.fn(async (callback) => await callback({}));
  const useCase = new RotateProjectApiKeyUseCase(
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
    replaceWithAudit,
    useCase,
    withActor,
    withTransaction,
  };
}

describe("RotateProjectApiKeyUseCase", () => {
  it("issues a new key, stops the previous key, and returns the new secret once", async () => {
    const { useCase, replaceWithAudit, withTransaction } = setup();

    const result = await useCase.execute({ projectId }, userId, organizationId);

    expect(result.key).not.toBe("");
    expect(result.key).not.toBe(apiKey.key);
    expect(result.key).toMatch(/^snb_pk_live_/);
    expect(result.createdAt).toBe(new Date(result.createdAt).toISOString());
    expect(withTransaction).toHaveBeenCalledTimes(1);
    expect(replaceWithAudit).toHaveBeenCalledTimes(1);
    expect(withTransaction.mock.invocationCallOrder[0]).toBeLessThan(replaceWithAudit.mock.invocationCallOrder[0] ?? 0);

    const revokedPrevious = replaceWithAudit.mock.calls[0]?.[0];
    const next = replaceWithAudit.mock.calls[0]?.[1];
    expect(revokedPrevious?.key).toBe(apiKey.key);
    expect(revokedPrevious?.revokedAt).toBeInstanceOf(Date);
    expect(revokedPrevious?.projectId).toBe(projectId);
    expect(next?.key).toBe(result.key);
    expect(next?.revokedAt).toBeNull();
    expect(next?.projectId).toBe(projectId);
  });

  it("does not leave the project without a key when there is no active key", async () => {
    const { useCase, replaceWithAudit } = setup(null);

    const result = await useCase.execute({ projectId }, userId, organizationId);

    const previous = replaceWithAudit.mock.calls[0]?.[0];
    const next = replaceWithAudit.mock.calls[0]?.[1];
    expect(previous).toBeNull();
    expect(next?.key).toBe(result.key);
    expect(replaceWithAudit).toHaveBeenCalledTimes(1);
  });

  it("does not rotate a key when the user has no organization", async () => {
    const { useCase, membershipPort, projectPort, withTransaction } = setup();

    await expect(useCase.execute({ projectId }, userId, null)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(membershipPort.findByUserAndOrganization).not.toHaveBeenCalled();
    expect(projectPort.findById).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("does not rotate a key for a project in another organization", async () => {
    const { useCase, projectPort, withTransaction } = setup();
    projectPort.findById.mockResolvedValue({
      ...project,
      organizationId: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
    });

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("does not rotate the key for a member", async () => {
    const { useCase, membershipPort, projectPort, apiKeyRepository, withTransaction } = setup();
    membershipPort.findByUserAndOrganization.mockResolvedValue({
      organizationId,
      role: UserRole.USER,
      id: "membership",
    });

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ADMIN_REQUIRED,
    });

    expect(projectPort.findById).not.toHaveBeenCalled();
    expect(apiKeyRepository.findActiveByProjectId).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("does not return a secret when the replacement is not saved", async () => {
    const { useCase, replaceWithAudit } = setup();
    replaceWithAudit.mockRejectedValue(new Error("save failed"));

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toThrow("save failed");
  });

  it("rejects a project the member cannot access without revoking a key", async () => {
    const { useCase, membershipPort, withTransaction } = setup();
    membershipPort.filterProjectIds.mockResolvedValue([]);

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });
});
