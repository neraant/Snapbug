import { FindProjectByKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-by-key.use-case";
import { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import { describe, expect, it, vi } from "vitest";

const key = "snapbug_test_key";
const projectId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const apiKey = new ApiKey({
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  projectId,
  key,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
  revokedAt: null,
});
const project = {
  id: projectId,
  name: "Acme Store",
  organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  createdAt: "2026-10-03T09:00:00.000Z",
};

describe("FindProjectByKeyUseCase", () => {
  it("returns the public project for an active key", async () => {
    const apiKeyRepository = { findByKey: vi.fn().mockResolvedValue(apiKey) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const useCase = new FindProjectByKeyUseCase(
      apiKeyRepository as unknown as ApiKeyRepository,
      projectPort as unknown as ProjectPort,
    );

    const result = await useCase.execute({ key });

    expect(projectPort.findById).toHaveBeenCalledWith(projectId);
    expect(result).toEqual(project);
  });

  it("does not expose a project for a revoked key", async () => {
    const apiKeyRepository = {
      findByKey: vi.fn().mockResolvedValue(new ApiKey({ ...apiKey.toObject(), revokedAt: new Date() })),
    };
    const projectPort = { findById: vi.fn() };
    const useCase = new FindProjectByKeyUseCase(
      apiKeyRepository as unknown as ApiKeyRepository,
      projectPort as unknown as ProjectPort,
    );

    const result = await useCase.execute({ key });

    expect(result).toBeNull();
    expect(projectPort.findById).not.toHaveBeenCalled();
  });
});
