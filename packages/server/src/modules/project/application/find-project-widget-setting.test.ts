import { FindProjectWidgetSettingUseCase } from "@workspace/server/modules/project/application/find-project-widget-setting.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
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
});

describe("FindProjectWidgetSettingUseCase", () => {
  it("returns public widget settings for an organization project", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(project) };
    const useCase = new FindProjectWidgetSettingUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.execute({ projectId }, userId, organizationId);

    expect(projectRepository.findById).toHaveBeenCalledWith(projectId);
    expect(result).toEqual(projectWidgetSettingModelDefaults);
  });

  it("rejects a project outside the user's organization", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
    };
    const projectRepository = {
      findById: vi
        .fn()
        .mockResolvedValue(
          new Project({ ...project.toObject(), organizationId: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4" }),
        ),
    };
    const useCase = new FindProjectWidgetSettingUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });
  });

  it("rejects users without an organization before loading a project", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const projectRepository = { findById: vi.fn() };
    const useCase = new FindProjectWidgetSettingUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectRepository.findById).not.toHaveBeenCalled();
  });
});
