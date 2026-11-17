import { createNotificationPortMock } from "@workspace/server/modules/notification/application/notification-test.const";
import { projectTestFields } from "@workspace/server/modules/project/application/project-test.const";
import { RestoreProjectUseCase } from "@workspace/server/modules/project/application/restore-project.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const archivedProject = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: persistedAt,
  ...projectTestFields,
  archivedAt: new Date("2026-11-01T12:00:00.000Z"),
});

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: "admin" as const,
  createdAt: persistedAt.toISOString(),
};

describe("RestoreProjectUseCase", () => {
  it("restores the project and returns a public dto", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const projectRepository = { findById: vi.fn().mockResolvedValue(archivedProject) };
    const projectService = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ saveWithAudit }) }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new RestoreProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      createNotificationPortMock(),
      withTransaction as WithTransactionType,
    );

    const result = await useCase.execute({ projectId }, userId);

    expect(saveWithAudit).toHaveBeenCalledOnce();
    expect(result.archivedAt).toBeNull();
    expect(result).toEqual(ProjectMapper.toDto(saveWithAudit.mock.calls[0]?.[0]));
  });
});
