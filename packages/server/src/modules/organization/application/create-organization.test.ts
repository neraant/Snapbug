import { CreateOrganizationUseCase } from "@workspace/server/modules/organization/application/create-organization.use-case";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const input = {
  name: "Acme",
};

const project = {
  id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  name: "Default project",
  organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  createdAt: "2026-10-03T09:00:00.000Z",
};

describe("CreateOrganizationUseCase", () => {
  it("creates an organization, an admin membership, and a default project", async () => {
    const organizationRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const membershipPort = {
      create: vi.fn().mockResolvedValue(null),
    };
    const projectPort = { create: vi.fn().mockResolvedValue(project) };
    const useCase = new CreateOrganizationUseCase(
      organizationRepository as unknown as OrganizationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
    );

    const result = await useCase.execute(input, userId);

    expect(organizationRepository.save).toHaveBeenCalledOnce();
    const saved = organizationRepository.save.mock.calls[0]?.[0];
    expect(saved.name).toBe(input.name);
    expect(saved.reports_retention_days).toBe(90);
    expect(membershipPort.create).toHaveBeenCalledWith({ organizationId: saved.id }, userId);
    expect(projectPort.create).toHaveBeenCalledWith(
      { organizationId: saved.id, name: "Default project", color: "#F97316" },
      userId,
    );
    expect(result).toEqual({
      organization: OrganizationMapper.toDto(saved),
      project,
    });
  });

  it("uses the given reports retention", async () => {
    const organizationRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const membershipPort = {
      create: vi.fn().mockResolvedValue(null),
    };
    const projectPort = { create: vi.fn().mockResolvedValue(project) };
    const useCase = new CreateOrganizationUseCase(
      organizationRepository as unknown as OrganizationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
    );

    await useCase.execute({ name: "Acme", reports_retention_days: 30 }, userId);

    const saved = organizationRepository.save.mock.calls[0]?.[0];
    expect(saved.reports_retention_days).toBe(30);
  });

  it("creates another organization when the user already belongs to one", async () => {
    const organizationRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const membershipPort = {
      create: vi.fn().mockResolvedValue(null),
    };
    const projectPort = { create: vi.fn().mockResolvedValue(project) };
    const useCase = new CreateOrganizationUseCase(
      organizationRepository as unknown as OrganizationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
    );

    await useCase.execute(input, userId);

    expect(organizationRepository.save).toHaveBeenCalledOnce();
    expect(membershipPort.create).toHaveBeenCalledOnce();
    expect(projectPort.create).toHaveBeenCalledOnce();
  });
});
