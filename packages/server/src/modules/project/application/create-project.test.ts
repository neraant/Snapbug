import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const input = {
  organizationId,
  name: "Acme Store",
};

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: "2026-10-03T09:00:00.000Z",
};

describe("CreateProjectUseCase", () => {
  it("creates a project and returns a public dto", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const useCase = new CreateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    const result = await useCase.execute(input, userId);

    expect(membershipPort.findByUserAndOrganization).toHaveBeenCalledWith({ userId, organizationId });
    expect(projectRepository.save).toHaveBeenCalledOnce();
    const saved = projectRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(ProjectMapper.toDto(saved));
    expect(saved.name).toBe(input.name);
    expect(saved.organizationId).toBe(organizationId);
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const projectRepository = { save: vi.fn() };
    const useCase = new CreateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectRepository as unknown as ProjectRepository,
    );

    await expect(useCase.execute(input, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectRepository.save).not.toHaveBeenCalled();
  });
});
