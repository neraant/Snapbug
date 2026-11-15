import { DeleteProjectUseCase } from "@workspace/server/modules/project/application/delete-project.use-case";
import { projectTestFields } from "@workspace/server/modules/project/application/project-test.const";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { ProjectApiKeyPort } from "@workspace/server/modules/project/port/api-key.port";
import type { BugReportPort } from "@workspace/server/modules/project/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const project = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: persistedAt,
  ...projectTestFields,
});

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: "admin" as const,
  createdAt: persistedAt.toISOString(),
};

describe("DeleteProjectUseCase", () => {
  it("deletes tickets, api keys, and the project", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(project) };
    const deleteProjectTicketsAndFiles = vi.fn().mockResolvedValue(undefined);
    const bugReportPort = { deleteProjectTicketsAndFiles };
    const deleteByProjectId = vi.fn().mockResolvedValue(undefined);
    const apiKeyPort = {
      withTx: vi.fn().mockReturnValue({ deleteByProjectId }),
    };
    const deleteWithAudit = vi.fn().mockResolvedValue(undefined);
    const projectService = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ deleteWithAudit }) }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new DeleteProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      bugReportPort as unknown as BugReportPort,
      apiKeyPort as unknown as ProjectApiKeyPort,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    await useCase.execute({ projectId }, userId);

    expect(deleteProjectTicketsAndFiles).toHaveBeenCalledWith(projectId);
    expect(deleteByProjectId).toHaveBeenCalledWith(projectId);
    expect(deleteWithAudit).toHaveBeenCalledWith(project, "Delete project");
  });
});
