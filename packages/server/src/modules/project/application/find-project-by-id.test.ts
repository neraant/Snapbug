import { FindProjectByIdUseCase } from "@workspace/server/modules/project/application/find-project-by-id.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { describe, expect, it, vi } from "vitest";

const projectId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const project = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  widgetSettings: null,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("FindProjectByIdUseCase", () => {
  it("returns the public project when it exists", async () => {
    const projectRepository = { findById: vi.fn().mockResolvedValue(project) };
    const useCase = new FindProjectByIdUseCase(projectRepository as unknown as ProjectRepository);

    const result = await useCase.execute(projectId);

    expect(projectRepository.findById).toHaveBeenCalledWith(projectId);
    expect(result).toEqual(ProjectMapper.toDto(project));
  });

  it("returns null when the project does not exist", async () => {
    const projectRepository = { findById: vi.fn().mockResolvedValue(null) };
    const useCase = new FindProjectByIdUseCase(projectRepository as unknown as ProjectRepository);

    const result = await useCase.execute(projectId);

    expect(result).toBeNull();
  });
});
