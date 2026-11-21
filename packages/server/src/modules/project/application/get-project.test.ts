import { GetProjectUseCase } from "@workspace/server/modules/project/application/get-project.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { projectTestFields } from "@workspace/server/modules/project/application/project-test.const";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const projectId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

const project = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
  ...projectTestFields,
});

describe("GetProjectUseCase", () => {
  it("returns a project the member can access", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId, role: "admin" }),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(project) };
    const useCase = new GetProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.execute({ projectId }, userId);

    expect(result.id).toBe(projectId);
  });

  it("does not return a project outside the member's access", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId, role: "member" }),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(project) };
    const useCase = new GetProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.execute({ projectId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });
  });
});
