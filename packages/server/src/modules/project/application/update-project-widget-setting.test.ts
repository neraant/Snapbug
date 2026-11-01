import { UpdateProjectWidgetSettingUseCase } from "@workspace/server/modules/project/application/update-project-widget-setting.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
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

describe("UpdateProjectWidgetSettingUseCase", () => {
  it("updates widget settings and records the change", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(project) };
    const saveWithAudit = vi.fn();
    const withActor = vi.fn().mockReturnValue({ saveWithAudit });
    const projectService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateProjectWidgetSettingUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    const result = await useCase.execute(
      { projectId, settings: projectWidgetSettingModelDefaults },
      userId,
      organizationId,
    );

    expect(withActor).toHaveBeenCalledWith({ type: "user", id: userId });
    expect(saveWithAudit).toHaveBeenCalledWith(expect.any(Project), "Update project widget settings");
    expect(result).toEqual(projectWidgetSettingModelDefaults);
  });

  it("rejects a project outside the user's organization without recording a change", async () => {
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
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new UpdateProjectWidgetSettingUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    await expect(
      useCase.execute({ projectId, settings: projectWidgetSettingModelDefaults }, userId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.PROJECT_NOT_FOUND });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("rejects users without an organization before loading a project", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const projectRepository = { findById: vi.fn() };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new UpdateProjectWidgetSettingUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    await expect(
      useCase.execute({ projectId, settings: projectWidgetSettingModelDefaults }, userId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND });

    expect(projectRepository.findById).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });
});
