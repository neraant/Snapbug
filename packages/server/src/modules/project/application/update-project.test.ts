import { UpdateProjectUseCase } from "@workspace/server/modules/project/application/update-project.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingProject = new Project({
  id: projectId,
  name: "Acme Store",
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
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.execute({ projectId, name: "Acme Checkout" }, userId);

    expect(projectRepository.findById).toHaveBeenCalledWith(projectId);
    expect(membershipPort.findByUserAndOrganization).toHaveBeenCalledWith({ userId, organizationId });
    expect(projectRepository.save).toHaveBeenCalledOnce();
    const saved = projectRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(ProjectMapper.toDto(saved));
    expect(saved.name).toBe("Acme Checkout");
  });

  it("throws when the project is missing", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn() };
    const projectRepository = { findById: vi.fn().mockResolvedValue(null), save: vi.fn() };
    const useCase = new UpdateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.execute({ projectId, name: "Acme Checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(membershipPort.findByUserAndOrganization).not.toHaveBeenCalled();
    expect(projectRepository.save).not.toHaveBeenCalled();
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
      save: vi.fn(),
    };
    const useCase = new UpdateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.execute({ projectId, name: "Acme Checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectRepository.save).not.toHaveBeenCalled();
  });
});
