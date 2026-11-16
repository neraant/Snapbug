import { ListProjectsUseCase } from "@workspace/server/modules/project/application/list-projects.use-case";
import { projectTestFields } from "@workspace/server/modules/project/application/project-test.const";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const projectId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

const membership = {
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const project = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
  ...projectTestFields,
});

describe("ListProjectsUseCase", () => {
  it("returns projects the token owner can access across memberships", async () => {
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const projectRepository = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([project]),
    };
    const useCase = new ListProjectsUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.execute(userId);

    expect(membershipPort.findManyByUser).toHaveBeenCalledWith(userId);
    expect(result).toEqual([expect.objectContaining({ id: projectId, slug: project.slug })]);
  });

  it("returns no projects when the member has no project access", async () => {
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const projectRepository = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([project]),
    };
    const useCase = new ListProjectsUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.execute(userId);

    expect(result).toEqual([]);
  });
});
