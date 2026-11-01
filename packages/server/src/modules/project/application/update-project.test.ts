import { UpdateProjectUseCase } from "@workspace/server/modules/project/application/update-project.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingProject = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: persistedAt,
});

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: "admin" as const,
  createdAt: persistedAt.toISOString(),
};

describe("UpdateProjectUseCase", () => {
  it("updates the project name and returns a public dto", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
    };
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const projectService = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ saveWithAudit }) }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    const result = await useCase.execute({ projectId, name: "Acme Checkout" }, userId);

    expect(saveWithAudit).toHaveBeenCalledOnce();
    expect(result).toEqual(ProjectMapper.toDto(saveWithAudit.mock.calls[0]?.[0]));
  });

  it("throws when the project is missing", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn(),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(null) };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new UpdateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    await expect(useCase.execute({ projectId, name: "Acme Checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(membershipPort.findByUserAndOrganization).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
    };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new UpdateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    await expect(useCase.execute({ projectId, name: "Acme Checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });
});
