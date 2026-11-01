import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const project = new Project({
  id: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("FindProjectsUseCase", () => {
  it("returns public projects for the user's organization", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId, id: "membership", role: "admin" }),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const projectRepository = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]) };
    const useCase = new FindProjectsUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.executeForUser(userId, organizationId);

    expect(projectRepository.findManyByOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(result).toEqual([ProjectMapper.toDto(project)]);
  });

  it("rejects users without an organization before loading projects", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const projectRepository = { findManyByOrganizationId: vi.fn() };
    const useCase = new FindProjectsUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.executeForUser(userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectRepository.findManyByOrganizationId).not.toHaveBeenCalled();
  });

  it("returns only projects on the member allow-list", async () => {
    const hiddenProject = new Project({ ...project.toObject(), id: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4" });
    const membership = { id: "membership", organizationId, role: UserRole.USER };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([project.id]),
    };
    const projectRepository = { findManyByOrganizationId: vi.fn().mockResolvedValue([project, hiddenProject]) };
    const useCase = new FindProjectsUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.executeForUser(userId, organizationId);

    expect(membershipPort.filterProjectIds).toHaveBeenCalledWith(membership, [project.id, hiddenProject.id]);
    expect(result).toEqual([ProjectMapper.toDto(project)]);
  });
});
